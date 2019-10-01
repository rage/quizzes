import dotenv from "dotenv"
import Knex from "knex"

import {
  ExerciseData,
  PointsByGroup,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
} from "../types"

// tslint:disable-next-line:no-var-requires
const Kafka = require("node-rdkafka")

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env` })
}

const knex = Knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "/var/run/postgresql",
    database: process.env.DB_NAME,
  },
})

const producer = new Kafka.Producer({
  "metadata.broker.list": "localhost:9092",
  dr_cb: true,
})

const publish = async () => {
  const tasks = await knex<IKafkaTask>("kafka_task").orderBy("created_at")

  let task: IKafkaTask

  for (task of tasks) {
    const { course_id, recalculate_progress } = task

    if (course_id) {
      if (recalculate_progress) {
        await recalculateProgress(course_id)
      }

      const quizzes = await publishQuizzes(course_id)

      await publishAnswers(course_id)

      await publishProgress(course_id, quizzes)
    }
  }

  // we don't want this yet
  /*
  await knex("kafka_task")
    .where("id", "in", tasks.map(t => t.id))
    .del()
  */

  producer.disconnect()
  process.exit()
}

const recalculateProgress = async (courseId: string) => {
  await knex.raw(
    `
    insert into user_course_part_state(user_id, course_id, course_part, progress, score)
    select
      parts.user_id as user_id,
      parts.course_id as course_id,
      parts.part as course_part,
      coalesce(points.points / max.max_points, 0) as progress,
      coalesce(points.points, 0) as score
    from (
      select
        distinct(user_id),
        course_id,
        part
      from user_course_part_state ucps
      cross join (
        select
          distinct(part)
        from quiz q
        where q.course_id = :courseId) as p
      where ucps.course_id = :courseId
    ) as parts
    left join (
      select
        q.course_id,
        uqs.user_id,
        q.part,
        sum(uqs.points_awarded) as points
      from user_quiz_state uqs
      join quiz q on uqs.quiz_id = q.id
      where q.course_id = :courseId
      and q.excluded_from_score = false
      group by q.course_id, uqs.user_id, q.part
    ) as points
    on parts.course_id = points.course_id
    and parts.user_id = points.user_id
    and parts.part = points.part
    join (
      select
        q.part,
        sum(q.points) as max_points
      from quiz q
      where q.course_id = :courseId
      and q.excluded_from_score = false
      group by q.part
    ) as max
    on parts.part = max.part
    on conflict (user_id, course_id, course_part)
    do update
    set progress = excluded.progress, score = excluded.score
    `,
    {
      courseId,
    },
  )
}

const publishQuizzes = async (courseId: string): Promise<any[]> => {
  const quizzes = await knex("quiz")
    .join("quiz_translation", { "quiz.id": "quiz_translation.quiz_id" })
    .where({
      course_id: courseId,
      excluded_from_score: false,
    })
    .andWhereNot("part", 0)

  const data: ExerciseData[] = quizzes.map(quiz => {
    return {
      name: quiz.title,
      id: quiz.id,
      part: quiz.part,
      section: quiz.section,
      max_points: quiz.excludedFromScore ? 0 : quiz.points,
      deleted: false,
    }
  })

  const message: QuizMessage = {
    timestamp: new Date().toISOString(),
    course_id: courseId,
    service_id: process.env.SERVICE_ID,
    data,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
  }

  producer.produce("exercise", null, Buffer.from(JSON.stringify(message)))
  producer.flush()

  return quizzes
}

const publishAnswers = async (courseId: string) => {
  const distinctTypes = knex("quiz")
    .select([
      "quiz.id",
      knex.raw("json_agg(distinct(quiz_item.type)) as types"),
    ])
    .join("quiz_item", { "quiz.id": "quiz_item.quiz_id" })
    .groupBy("quiz.id")
    .as("types")

  const latest = knex("quiz_answer")
    .select([
      "id",
      knex.raw(
        "row_number() over(partition by user_id, quiz_id order by created_at desc) as rn",
      ),
    ])
    .as("latest")

  const answers = await knex("user_quiz_state")
    .select([
      "quiz_answer.quiz_id",
      "user_quiz_state.points_awarded",
      "quiz_answer.status",
      "quiz_answer.user_id",
      "types.types",
      "user_quiz_state.peer_reviews_given",
      "user_quiz_state.peer_reviews_received",
      "quiz.excluded_from_score",
    ])
    .join("quiz_answer", {
      "user_quiz_state.quiz_id": "quiz_answer.quiz_id",
      "user_quiz_state.user_id": "quiz_answer.user_id",
    })
    .join("quiz", { "user_quiz_state.quiz_id": "quiz.id" })
    .join(distinctTypes, { "user_quiz_state.quiz_id": "types.id" })
    .where("quiz.course_id", courseId)
    .andWhere(
      "quiz_answer.id",
      "in",
      knex(latest)
        .select("id")
        .where("rn", 1),
    )

  const course = (await knex("course").where("id", courseId))[0]

  let answer

  for (answer of answers) {
    const messages: string[] = []

    if (answer.status === "rejected" || answer.status === "spam") {
      messages.push("rejected in peer review")
    } else if (answer.types.includes("essay")) {
      if (answer.peer_reviews_given < course.min_peer_reviews_given) {
        messages.push("give peer reviews")
      }
      if (answer.peer_reviews_received < course.min_peer_reviews_received) {
        messages.push("waiting for peer reviews")
      }
    }

    const message: QuizAnswerMessage = {
      timestamp: new Date().toISOString(),
      exercise_id: answer.quiz_id,
      n_points: answer.excluded_from_score ? 0 : answer.points_awarded || 0,
      completed: answer.status === "confirmed",
      user_id: answer.user_id,
      course_id: courseId,
      service_id: process.env.SERVICE_ID,
      required_actions: messages,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }

    producer.produce("user-points", null, Buffer.from(JSON.stringify(message)))
    producer.flush()
  }
}

const publishProgress = async (courseId: string, quizzes: any[]) => {
  const maxPointsByPart: { [part: number]: number } = {}

  quizzes.forEach(({ part, points }) =>
    maxPointsByPart[part]
      ? (maxPointsByPart[part] += points)
      : (maxPointsByPart[part] = points),
  )

  const userCoursePartStates = await knex<IUserCoursePartState>(
    "user_course_part_state",
  )
    .where({ course_id: courseId })
    .andWhereNot("course_part", 0)
    .orderBy(["user_id", "course_part"])

  let group: IUserCoursePartState[] = []
  const groupedByUser: IUserCoursePartState[][] = []
  userCoursePartStates.forEach((ucps, i, arr) => {
    group.push(ucps)
    const next = i + 1
    if (next < arr.length && ucps.user_id !== arr[next].user_id) {
      groupedByUser.push(group)
      group = []
    }
  })

  for (group of groupedByUser) {
    const progress: PointsByGroup[] = group.map(ucps => {
      const coursePartString: string = ucps.course_part.toString()
      return {
        group: `${
          coursePartString.length > 1 ? "osa" : "osa0"
        }${coursePartString}`,
        progress: Math.floor(ucps.progress * 100) / 100,
        n_points: Number(ucps.score.toFixed(2)),
        max_points: maxPointsByPart[ucps.course_part],
      }
    })
    const message: ProgressMessage = {
      timestamp: new Date().toISOString(),
      user_id: group[0].user_id,
      course_id: group[0].course_id,
      service_id: process.env.SERVICE_ID,
      progress,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }
    producer.produce(
      "user-course-progress",
      null,
      Buffer.from(JSON.stringify(message)),
    )
    producer.flush()
  }
}

interface IKafkaTask {
  id: string
  course_id: string
  quiz_id: string
  recalculate_progress: boolean
  created_at: Date
}

interface IUserCoursePartState {
  user_id: number
  course_id: string
  course_part: number
  progress: number
  score: number
  completed: boolean
  created_at: Date
  updated_at: Date
}

producer.on("ready", publish)

producer.connect()
