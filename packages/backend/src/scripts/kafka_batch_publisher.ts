import dotenv from "dotenv"
import Knex from "knex"

import { PointsByGroup, ProgressMessage } from "../types"

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
    const { course_id } = task

    if (course_id) {
      const maxPointsByPart: { [part: number]: number } = {}
      ;(await knex("quiz")
        .select("part")
        .sum("points")
        .andWhere({
          course_id,
          excluded_from_score: false,
        })
        .andWhereNot("part", 0)
        .groupBy("part")).forEach(
        ({ part, sum }) => (maxPointsByPart[part] = sum),
      )

      const userCoursePartStates = await knex<IUserCoursePartState>(
        "user_course_part_state",
      )
        .where({ course_id })
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
  }

  process.exit()
}

interface IKafkaTask {
  id: string
  course_id: string
  quiz_id: string
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

interface IPartPointsResult {
  part: number
  sum: number
}

producer.on("ready", publish)

producer.connect()
