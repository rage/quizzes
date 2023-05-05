import * as Kafka from "node-rdkafka"
import { promisify } from "util"

import { quizzes as knex } from "../config/knex"
import { RequiredAction } from "../services/kafka.service"
import {
  ExerciseData,
  PointsByGroup,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
  CourseQuizAnswersMessage,
} from "../types"

// this is the old one that pushes one exercise at a time
const USE_USER_POINTS_BATCH = process.env.USE_USER_POINTS_BATCH === "true"

const producer = new Kafka.Producer({
  "metadata.broker.list": process.env.KAFKA_HOST || "localhost:9092",
  dr_cb: false,
})

const flush = promisify(producer.flush.bind(producer))

const publish = async () => {
  console.time("done in")
  try {
    const tasks = await knex<IKafkaTask>("kafka_task").orderBy("created_at")

    console.log(new Date())
    console.log(
      `will perform ${tasks.length} task${tasks.length > 1 ? "s" : ""}`,
    )

    let task: IKafkaTask

    for (task of tasks) {
      const {
        course_id,
        user_id,
        recalculate_progress,
        recalculate_only,
      } = task

      console.count("task")
      console.log(
        `publish data for course ${course_id} ${
          recalculate_progress ? "and recalculate progress" : ""
        }`,
      )

      const course = (
        await knex<ICourse>("course").where("id", task.course_id)
      )[0]

      if (course_id) {
        if (recalculate_progress) {
          console.log("recalculating progress")
          await recalculateProgress(course_id)
        }

        if (!recalculate_only) {
          if (course.moocfi_id) {
            if (user_id) {
              const quizzes = await knex<IQuiz>("quiz")
                .join("quiz_translation", {
                  "quiz.id": "quiz_translation.quiz_id",
                })
                .where({
                  course_id,
                })
                .andWhereNot("part", 0)

              console.log("publishing progress for user: " + user_id)
              await publishProgress(course, quizzes, user_id)

              console.log("publishing answers for user: " + user_id)
              await publishCourseAnswers(course, user_id, {
                useUserPointsBatch: USE_USER_POINTS_BATCH,
              })
            } else {
              console.log("publishing quizzes")
              const quizzes = await publishQuizzes(course)

              console.log("publishing progress")
              await publishProgress(course, quizzes)

              console.log("publishing answers")
              await publishCourseAnswers(course, {
                useUserPointsBatch: USE_USER_POINTS_BATCH,
              })
            }
          } else {
            console.error("No moocfi_id for task. Aborting.")
          }
        }
      }

      console.log("removing task from database")
      await knex("kafka_task")
        .where("id", task.id)
        .del()
    }

    console.timeEnd("done in")
  } catch (error) {
    console.log(error)
  }

  producer.disconnect()
  process.exit()
}

const recalculateProgress = async (courseId: string) => {
  try {
    await knex.raw(
      `
      insert into user_course_part_state(user_id, course_id, course_part, progress, score)
      select
        parts.user_id as user_id,
        parts.course_id as course_id,
        parts.part as course_part,
        coalesce(
          case when max.max_points is not null and max.max_points > 0 then (points.points / max.max_points) end, 0
        ) as progress,
        coalesce(points.points, 0) as score
      from (
        select distinct on (uqs.user_id, q.part)
          uqs.user_id,
          q.part,
          q.course_id
        from user_quiz_state uqs
        cross join quiz q
        where q.course_id = :courseId
        and uqs.quiz_id in (
          select
            id
          from quiz
          where course_id = :courseId
        )
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
      left join (
        select
          q.course_id,
          q.part,
          sum(q.points) as max_points
        from quiz q
        where q.course_id = :courseId
        and q.excluded_from_score = false
        group by q.course_id, q.part
      ) as max
      on parts.part = max.part and parts.course_id = max.course_id
      on conflict (user_id, course_id, course_part)
      do update
      set progress = excluded.progress, score = excluded.score
      `,
      {
        courseId,
      },
    )
  } catch (error) {
    console.log("error while recalculating progress")
    throw error
  }
}

const publishQuizzes = async (course: ICourse): Promise<IQuiz[]> => {
  try {
    const courseId = course.id

    const quizzes = await knex<IQuiz>("quiz")
      .join("quiz_translation", { "quiz.id": "quiz_translation.quiz_id" })
      .where({
        course_id: courseId,
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
      course_id: course.moocfi_id,
      service_id: process.env.SERVICE_ID,
      data,
      message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    }

    producer.produce("exercise", null, Buffer.from(JSON.stringify(message)))
    await flush(10000)

    console.log(`published ${quizzes.length} quizzes`)

    return quizzes
  } catch (error) {
    console.log("error while publishing quizzes")
    throw error
  }
}

const getAnswers = async (courseId: string, userId?: string) => {
  const distinctTypes = knex("quiz")
    .select([
      "quiz.id",
      knex.raw("json_agg(distinct(quiz_item.type)) as types"),
    ])
    .join("quiz_item", { "quiz.id": "quiz_item.quiz_id" })
    .groupBy("quiz.id")
    .as("types")

  // why isn't this used?
  const latest = knex("quiz_answer")
    .select([
      "id",
      knex.raw(
        "row_number() over(partition by user_id, quiz_id order by created_at desc) as rn",
      ),
    ])
    .as("latest")

  const answersQuery = knex<any, IPublishQuizAnswer>("user_quiz_state")
    .select([
      "quiz_answer.quiz_id",
      "quiz_answer.created_at",
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
    .andWhereNot("quiz_answer.status", "deprecated")

  if (userId) {
    answersQuery.andWhere("quiz_answer.user_id", userId)
  }

  const answers: IPublishQuizAnswer[] = await answersQuery

  return answers
}

const createAnswerMessage = (answer: IPublishQuizAnswer, course: ICourse) => {
  const actions: RequiredAction[] = []

  if (answer.status === "rejected" || answer.status === "spam") {
    actions.push(RequiredAction.REJECTED)
  } else if (answer.types.includes("essay")) {
    if (answer.peer_reviews_given < course.min_peer_reviews_given) {
      actions.push(RequiredAction.GIVE_PEER_REVIEW)
    }
    if (answer.peer_reviews_received < course.min_peer_reviews_received) {
      actions.push(RequiredAction.PENDING_PEER_REVIEW)
    }
  }

  const message: QuizAnswerMessage = {
    timestamp: new Date().toISOString(),
    original_submission_date: answer.created_at,
    exercise_id: answer.quiz_id,
    n_points: answer.excluded_from_score ? 0 : answer.points_awarded || 0,
    completed: answer.status === "confirmed",
    user_id: answer.user_id,
    course_id: course.moocfi_id,
    service_id: process.env.SERVICE_ID,
    required_actions: actions,
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    attempted: true,
  }

  return message
}

const createUnansweredMessage = (
  quiz: ICourseQuiz,
  course: ICourse,
  userId: string,
) => {
  const message: QuizAnswerMessage = {
    timestamp: new Date().toISOString(),
    original_submission_date: null,
    exercise_id: quiz.quiz_id,
    n_points: 0,
    completed: false,
    user_id: Number(userId),
    course_id: course.moocfi_id,
    service_id: process.env.SERVICE_ID,
    required_actions: [],
    message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
    attempted: false,
  }
  return message
}

const publishAnswers = async (course: ICourse, userId?: string) => {
  const courseId = course.id

  const answers = await getAnswers(courseId, userId)

  try {
    for (const answer of answers) {
      const message = createAnswerMessage(answer, course)

      producer.produce(
        "user-points-batch",
        null,
        Buffer.from(JSON.stringify(message)),
      )
      await flush(10000)
    }

    console.log(`published ${answers.length} answers`)
  } catch (error) {
    console.log("error while publishing answers")
    throw error
  }
}

interface PublishCourseAnswerOptions {
  useUserPointsBatch?: boolean
}

const publishCourseAnswers = async (
  course: ICourse,
  userIdOrOptions?: string | PublishCourseAnswerOptions,
  options?: PublishCourseAnswerOptions,
) => {
  let userId: string | undefined
  let _options: PublishCourseAnswerOptions | undefined = options
  if (typeof userIdOrOptions === "string") {
    userId = userIdOrOptions
  } else {
    _options = userIdOrOptions
  }
  const { useUserPointsBatch = false } = _options || {}

  try {
    const courseId = course.id

    const courseQuizzes = await knex("quiz")
      .select<any, ICourseQuiz[]>([
        "quiz.id as quiz_id",
        "quiz.excluded_from_score",
      ])
      .where("course_id", courseId)

    let answererIds: string[] = []
    if (userId) {
      answererIds = [userId]
    } else {
      const uniqueAnswerers = await knex("quiz_answer")
        .distinct("user_id")
        .join("quiz", { "quiz_answer.quiz_id": "quiz.id" })
        .where("quiz.course_id", courseId)
        .whereNotNull("user_id")
        .andWhereNot("quiz_answer.status", "deprecated")

      answererIds = uniqueAnswerers.map(a => a.user_id)
    }

    for (const answererId of answererIds) {
      const answers = await getAnswers(courseId, answererId)

      const answeredIds = answers.map(a => a.quiz_id)
      const unansweredQuizzes = courseQuizzes.filter(
        q => !answeredIds.includes(q.quiz_id),
      )

      const exercises: QuizAnswerMessage[] = []

      for (const answer of answers) {
        const exercise = createAnswerMessage(answer, course)
        if (useUserPointsBatch) {
          producer.produce(
            "user-points-batch",
            null,
            Buffer.from(JSON.stringify(exercise)),
          )
          await flush(10000)
        }
        exercises.push(exercise)
      }

      for (const unanswered of unansweredQuizzes) {
        const exercise = createUnansweredMessage(unanswered, course, answererId)

        if (useUserPointsBatch) {
          producer.produce(
            "user-points-batch",
            null,
            Buffer.from(JSON.stringify(exercise)),
          )
          await flush(10000)
        }
        exercises.push(exercise)
      }

      if (useUserPointsBatch) {
        return
      }

      const message: CourseQuizAnswersMessage = {
        timestamp: new Date().toISOString(),
        user_id: Number(answererId),
        course_id: course.moocfi_id,
        exercises,
        message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
      }
      producer.produce(
        "user-course-points-batch",
        null,
        Buffer.from(JSON.stringify(message)),
      )
      await flush(10000)
    }
  } catch (error) {
    console.log("error while publishing course answers")
    throw error
  }
}

const publishProgress = async (
  course: ICourse,
  quizzes: any[],
  userId?: string,
) => {
  try {
    const courseId = course.id

    const maxPointsByPart: { [part: number]: number } = {}

    quizzes.forEach(({ part, points }) =>
      maxPointsByPart[part]
        ? (maxPointsByPart[part] += points)
        : (maxPointsByPart[part] = points),
    )

    const userCoursePartStatesQuery = knex<IUserCoursePartState>(
      "user_course_part_state",
    )
      .where({ course_id: courseId })
      .andWhereNot("course_part", 0)
      .orderBy(["user_id", "course_part"])

    if (userId) {
      userCoursePartStatesQuery.andWhere("user_id", userId)
    }

    const userCoursePartStates = await userCoursePartStatesQuery

    let group: IUserCoursePartState[] = []
    const groupedByUser: IUserCoursePartState[][] = []
    userCoursePartStates.forEach((ucps, i, arr) => {
      group.push(ucps)
      const next = i + 1
      if (next < arr.length && ucps.user_id !== arr[next].user_id) {
        groupedByUser.push(group)
        group = []
      } else if (next === arr.length) {
        groupedByUser.push(group)
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
          max_points: maxPointsByPart[ucps.course_part] ?? 0,
        }
      })
      const message: ProgressMessage = {
        timestamp: new Date().toISOString(),
        user_id: group[0].user_id,
        course_id: course.moocfi_id,
        service_id: process.env.SERVICE_ID,
        progress,
        message_format_version: Number(process.env.MESSAGE_FORMAT_VERSION),
      }
      producer.produce(
        "user-course-progress-batch",
        null,
        Buffer.from(JSON.stringify(message)),
      )
      await flush(10000)
    }

    console.log(`published progress for ${groupedByUser.length} users`)
  } catch (error) {
    console.log("error while publishing progress")
    throw error
  }
}

interface IKafkaTask {
  id: string
  course_id: string
  quiz_id: string
  user_id: string
  recalculate_progress: boolean
  recalculate_only: boolean
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

interface ICourse {
  id: string
  moocfi_id: string
  min_score_to_pass: number
  min_progress_to_pass: number
  min_peer_reviews_received: number
  min_peer_reviews_given: number
  min_review_average: number
  max_spam_flags: number
  max_review_spam_flags: number
  organization: any
}

interface IQuiz {
  id: string
  course_id: string
  part: number
  section: number
  points: number
  tries: number
  tries_limited: boolean
  deadline: Date
  open: Date
  auto_confirm: boolean
  excluded_from_score: boolean
  grantPointsPolicy: any
}

interface ICourseQuiz {
  quiz_id: string
  excluded_from_score: boolean
}

interface IPublishQuizAnswer {
  quiz_id: string
  created_at: string
  points_awarded: number
  status: string
  user_id: number
  types: string[]
  peer_reviews_given: number
  peer_reviews_received: number
  excluded_from_score: boolean
}

interface IPublishCourseQuizAnswer extends IPublishQuizAnswer {
  attempted: boolean
}

producer.on("ready", publish)

producer.connect({}, (err: any) => {
  if (err) {
    console.log("Producer failed to connect")
    console.log(err)
  }
})
