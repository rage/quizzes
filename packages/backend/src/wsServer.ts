import http from "http"
import WebSocketServer from "websocket"
import redis from "./config/redis"
import TMCApi from "./services/TMCApi"
import { ITMCProfileDetails } from "./types"

const webSocketsServerPort = 9000
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

const clients: { [userId: number]: any } = {}

export const pingClient = (userId: number, courseId: string) => {
  if (clients[userId] && clients[userId][courseId]) {
    const connection = clients[userId][courseId]
    if (connection.connected) {
      connection.sendUTF("ping")
    } else {
      delete clients[userId][courseId]
      redis.publisher.publish("websocket", `${userId}:${courseId}`)
    }
  } else {
    redis.publisher.publish("websocket", `${userId}:${courseId}`)
  }
}

wsServer.on("request", (request: any) => {
  console.log("request")
  let connection: any
  if (originAccepted[request.origin]) {
    console.log("request")
    connection = request.accept("echo-protocol", request.origin)
  } else {
    request.reject()
    console.log("connection rejected")
    return
  }

  connection.on("message", async (message: any) => {
    const data = JSON.parse(message.utf8Data)
    if (Array.isArray(data) && data.length === 2) {
      const token = data[0]
      const courseId = data[1]
      try {
        let user: ITMCProfileDetails = JSON.parse(await redis.get(token))
        if (!user) {
          user = await TMCApi.getProfile(token)
          redis.set(token, JSON.stringify(user), "EX", 3600)
        }
        clients[user.id] = {
          ...clients[user.id],
          [courseId]: connection,
        }
        console.log("connection confirmed")
      } catch (error) {
        connection.drop()
        console.log("unauthorized websocket connection")
      }
    } else {
      connection.drop()
    }
  })
})

redis.subscriber.on("message", (channel: any, message: any) => {
  const split = message.split(":")
  const userId = split[0]
  const courseId = split[1]
  if (clients[userId] && clients[userId][courseId]) {
    clients[userId][courseId].sendUTF("ping")
  }
})

redis.subscriber.subscribe("websocket")
