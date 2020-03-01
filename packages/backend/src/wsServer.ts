import http from "http"
import WebSocketServer from "websocket"
import redis from "./config/redis"
import TMCApi from "./services/TMCApi"
import { ITMCProfileDetails } from "./types"

const webSocketsServerPort = 7000
const server = http.createServer()
export const wsListen = () => server.listen(webSocketsServerPort)

const wsServer = new WebSocketServer.server({
  httpServer: server,
})

const originAccepted: { [origin: string]: boolean } = {
  "http://localhost:1234": true,
  "http://localhost:8000": true,
  "https://40f60d95.ngrok.io": true,
}

const connectionByUserCourse = new Map()
const userCourseByConnection = new Map()

export type MessageType =
  | "PROGRESS_UPDATED"
  | "PEER_REVIEW_RECEIVED"
  | "QUIZ_CONFIRMED"
  | "QUIZ_REJECTED"

export const pushMessageToClient = (
  userId: number,
  courseId: string,
  type: MessageType,
  payload?: string,
) => {
  const userCourseObjectString = JSON.stringify({ userId, courseId })
  const connection = connectionByUserCourse.get(userCourseObjectString)
  if (connection) {
    if (connection.connected) {
      connection.sendUTF(
        JSON.stringify({
          type,
          message: payload,
        }),
      )
    } else {
      connectionByUserCourse.delete(userCourseObjectString)
      redis.publisher.publish(
        "websocket",
        JSON.stringify({ userId, courseId, type, message: payload }),
      )
    }
  } else {
    redis.publisher.publish(
      "websocket",
      JSON.stringify({ userId, courseId, type, message: payload }),
    )
  }
}

wsServer.on("request", (request: any) => {
  console.log("request ", request.origin)
  let connection: any
  if (originAccepted[request.origin]) {
    connection = request.accept("echo-protocol", request.origin)
  } else {
    request.reject()
    console.log("connection rejected")
    return
  }

  connection.on("message", async (message: any) => {
    const data = JSON.parse(message.utf8Data)
    console.log(data)
    if (data instanceof Object && data.accessToken && data.courseId) {
      const accessToken = data.accessToken
      const courseId = data.courseId
      try {
        let user: ITMCProfileDetails = JSON.parse(await redis.get(accessToken))
        if (!user) {
          user = await TMCApi.getProfile(accessToken)
          redis.set(accessToken, JSON.stringify(user), "EX", 3600)
        }
        const userCourseObject = {
          userId: user.id,
          courseId,
        }
        connectionByUserCourse.set(JSON.stringify(userCourseObject), connection)
        userCourseByConnection.set(connection, userCourseObject)
        console.log("connection verified")
      } catch (error) {
        connection.drop()
        console.log("unauthorized websocket connection")
      }
    } else {
      connection.drop()
    }
  })

  connection.on("close", () => {
    const userCourseObjectString = JSON.stringify(
      userCourseByConnection.get(connection),
    )
    userCourseByConnection.delete(connection)
    connectionByUserCourse.delete(userCourseObjectString)
  })
})

redis.subscriber.on("message", (channel: any, message: any) => {
  const data = JSON.parse(message)
  if (data instanceof Object && data.userId && data.courseId && data.type) {
    const userId = data.userId
    const courseId = data.courseId
    const userCourseObjectString = JSON.stringify({ userId, courseId })
    const connection = connectionByUserCourse.get(userCourseObjectString)
    if (connection) {
      if (connection.connected) {
        connection.sendUTF(
          JSON.stringify({
            type: data.type,
            message: data.message,
          }),
        )
      } else {
        connectionByUserCourse.delete(userCourseObjectString)
      }
    }
  }
})

redis.subscriber.subscribe("websocket")
