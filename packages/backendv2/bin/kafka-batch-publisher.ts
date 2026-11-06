import { promisify } from "util"

import * as Kafka from "node-rdkafka"

import knex from "../database/knex"
import { GlobalLogger } from "../src/middleware/logger"
import {
  CourseQuizAnswersMessage,
  ExerciseData,
  PointsByGroup,
  ProgressMessage,
  QuizAnswerMessage,
  QuizMessage,
  RequiredAction,
} from "../src/types"

// Consumers in moocfi parse these payloads: field names, key order and value
// shapes must not change.

interface KafkaTask {
  id: string
  course_id: string | null
  user_id: number | null
  recalculate_progress: boolean
  recalculate_only?: boolean
  created_at: Date
}

interface CourseRow {
  id: string
  moocfi_id: string
  min_peer_reviews_received: number
  min_peer_reviews_given: number
}

/** A quiz joined with one translation; a quiz appears once per language. */
interface QuizTranslationRow {
  id: string
  title: string
  part: number
  section: number
  points: number
  excluded_from_score: boolean
}

interface CourseQuiz {
  quiz_id: string
  excluded_from_score: boolean
}

interface AnswerRow {
  quiz_id: string
  created_at: string
  points_awarded: number | null
  status: string
  user_id: number
  types: string[]
  peer_reviews_given: number
  peer_reviews_received: number
  excluded_from_score: boolean
}

interface UserCoursePartStateRow {
  user_id: number
  course_id: string
  course_part: number
  score: number
}

const { KAFKA_HOST, SERVICE_ID, MESSAGE_FORMAT_VERSION } = process.env

if (!KAFKA_HOST || !SERVICE_ID || !MESSAGE_FORMAT_VERSION) {
  GlobalLogger.error(
    "KAFKA_HOST, SERVICE_ID and MESSAGE_FORMAT_VERSION must be set",
  )
  process.exit(1)
}

const serviceId: string = SERVICE_ID
const messageFormatVersion = Number(MESSAGE_FORMAT_VERSION)

const producer = new Kafka.Producer({
  "metadata.broker.list": KAFKA_HOST,
  dr_cb: false,
  "security.protocol": "ssl",
  "enable.ssl.certificate.verification": false,
  "ssl.endpoint.identification.algorithm": "none",
})

const flush = promisify(producer.flush.bind(producer))

const produce = async (topic: string, message: object) => {
  producer.produce(topic, null, Buffer.from(JSON.stringify(message)))
  await flush(10000)
}

const publish = async () => {
  try {
    const tasks = await knex<KafkaTask>("kafka_task").orderBy("created_at")
    GlobalLogger.info(`Performing ${tasks.length} tasks`)

    for (const task of tasks) {
      const { course_id, user_id, recalculate_progress, recalculate_only } =
        task
      GlobalLogger.info(
        `Task ${task.id}: course ${course_id}, user ${user_id}, recalculate ${recalculate_progress}`,
      )

      if (course_id) {
        const course = await knex<CourseRow>("course")
          .where("id", course_id)
          .first()

        if (!course) {
          GlobalLogger.error(`Course ${course_id} not found`)
        } else {
          if (recalculate_progress) {
            await recalculateProgress(course_id)
          }

          if (!recalculate_only) {
            if (!course.moocfi_id) {
              GlobalLogger.error(`Course ${course_id} has no moocfi_id`)
            } else if (user_id) {
              const quizzes = await getQuizTranslations(course_id)
              await publishProgress(course, quizzes, user_id)
              await publishCourseAnswers(course, user_id)
            } else {
              const quizzes = await publishQuizzes(course)
              await publishProgress(course, quizzes)
              await publishCourseAnswers(course)
            }
          }
        }
      }

      await knex("kafka_task").where("id", task.id).del()
    }
    GlobalLogger.info("Done")
  } catch (error) {
    GlobalLogger.error(error)
  }

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
    { courseId },
  )
}

const getQuizTranslations = (courseId: string): Promise<QuizTranslationRow[]> =>
  knex("quiz")
    .join("quiz_translation", { "quiz.id": "quiz_translation.quiz_id" })
    .where({ course_id: courseId })
    .andWhereNot("part", 0)

const publishQuizzes = async (course: CourseRow) => {
  const quizzes = await getQuizTranslations(course.id)

  const data: ExerciseData[] = quizzes.map((quiz) => ({
    name: quiz.title,
    id: quiz.id,
    part: quiz.part,
    section: quiz.section,
    max_points: quiz.excluded_from_score ? 0 : quiz.points,
    deleted: false,
  }))

  const message: QuizMessage = {
    timestamp: new Date().toISOString(),
    course_id: course.moocfi_id,
    service_id: serviceId,
    data,
    message_format_version: messageFormatVersion,
  }
  await produce("exercise", message)
  GlobalLogger.info(`Published ${quizzes.length} quizzes`)

  return quizzes
}

const getAnswers = async (
  courseId: string,
  userId: number,
): Promise<AnswerRow[]> => {
  const distinctTypes = knex("quiz")
    .select([
      "quiz.id",
      knex.raw("json_agg(distinct(quiz_item.type)) as types"),
    ])
    .join("quiz_item", { "quiz.id": "quiz_item.quiz_id" })
    .groupBy("quiz.id")
    .as("types")

  return knex("user_quiz_state")
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
    .andWhere("quiz_answer.deleted", false)
    .andWhere("quiz_answer.user_id", userId)
}

const createAnswerMessage = (
  answer: AnswerRow,
  course: CourseRow,
): QuizAnswerMessage => {
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

  return {
    timestamp: new Date().toISOString(),
    original_submission_date: answer.created_at,
    exercise_id: answer.quiz_id,
    n_points: answer.excluded_from_score ? 0 : answer.points_awarded || 0,
    completed: answer.status === "confirmed",
    user_id: answer.user_id,
    course_id: course.moocfi_id,
    service_id: serviceId,
    required_actions: actions,
    message_format_version: messageFormatVersion,
    attempted: true,
  }
}

const createUnansweredMessage = (
  quiz: CourseQuiz,
  course: CourseRow,
  userId: number,
): QuizAnswerMessage => ({
  timestamp: new Date().toISOString(),
  original_submission_date: null,
  exercise_id: quiz.quiz_id,
  n_points: 0,
  completed: false,
  user_id: userId,
  course_id: course.moocfi_id,
  service_id: serviceId,
  required_actions: [],
  message_format_version: messageFormatVersion,
  attempted: false,
})

/** Publishes every answerer's per-quiz results, or only `userId`'s when given. */
const publishCourseAnswers = async (course: CourseRow, userId?: number) => {
  const courseQuizzes: CourseQuiz[] = await knex("quiz")
    .select(["quiz.id as quiz_id", "quiz.excluded_from_score"])
    .where("course_id", course.id)

  let answererIds: number[]
  if (userId) {
    answererIds = [userId]
  } else {
    const answerers: { user_id: number }[] = await knex("quiz_answer")
      .distinct("user_id")
      .join("quiz", { "quiz_answer.quiz_id": "quiz.id" })
      .where("quiz.course_id", course.id)
      .whereNotNull("user_id")
      .andWhereNot("quiz_answer.status", "deprecated")
    answererIds = answerers.map((a) => a.user_id)
  }

  for (const answererId of answererIds) {
    const answers = await getAnswers(course.id, answererId)
    const answeredIds = answers.map((a) => a.quiz_id)

    const exercises = [
      ...answers.map((answer) => createAnswerMessage(answer, course)),
      ...courseQuizzes
        .filter((q) => !answeredIds.includes(q.quiz_id))
        .map((q) => createUnansweredMessage(q, course, answererId)),
    ]

    const message: CourseQuizAnswersMessage = {
      timestamp: new Date().toISOString(),
      user_id: answererId,
      course_id: course.moocfi_id,
      exercises,
      message_format_version: messageFormatVersion,
    }
    await produce("user-course-points-batch", message)
  }
  GlobalLogger.info(`Published answers for ${answererIds.length} users`)
}

/**
 * Publishes per-part progress for every user in the course, or only `userId`.
 * Each part's max points are summed over `quizzes`.
 */
const publishProgress = async (
  course: CourseRow,
  quizzes: QuizTranslationRow[],
  userId?: number,
) => {
  const maxPointsByPart: { [part: number]: number } = {}
  quizzes.forEach(({ part, points, excluded_from_score }) => {
    if (!excluded_from_score) {
      maxPointsByPart[part] = (maxPointsByPart[part] ?? 0) + points
    }
  })

  const query = knex<UserCoursePartStateRow>("user_course_part_state")
    .where({ course_id: course.id })
    .andWhereNot("course_part", 0)
    .orderBy(["user_id", "course_part"])
  if (userId) {
    query.andWhere("user_id", userId)
  }
  const states: UserCoursePartStateRow[] = await query

  const statesByUser = new Map<number, UserCoursePartStateRow[]>()
  for (const state of states) {
    const userStates = statesByUser.get(state.user_id) ?? []
    userStates.push(state)
    statesByUser.set(state.user_id, userStates)
  }

  for (const [user, userStates] of statesByUser) {
    const progress: PointsByGroup[] = userStates.map((state) => {
      const coursePart = state.course_part.toString()
      const maxPoints = maxPointsByPart[state.course_part] ?? 0
      return {
        group: `${coursePart.length > 1 ? "osa" : "osa0"}${coursePart}`,
        progress: Math.round((state.score / maxPoints) * 100) / 100,
        n_points: Number(state.score.toFixed(2)),
        max_points: maxPoints,
      }
    })
    const message: ProgressMessage = {
      timestamp: new Date().toISOString(),
      user_id: user,
      course_id: course.moocfi_id,
      service_id: serviceId,
      progress,
      message_format_version: messageFormatVersion,
    }
    await produce("user-course-progress-batch", message)
  }
  GlobalLogger.info(`Published progress for ${statesByUser.size} users`)
}

producer.on("ready", publish)

producer.connect({}, (err) => {
  if (err) {
    GlobalLogger.error("Producer failed to connect", err)
    process.exit(1)
  }
})
