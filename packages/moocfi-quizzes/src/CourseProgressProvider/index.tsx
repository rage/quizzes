import * as React from "react"
import { useContext, useEffect, useState } from "react"
import CourseProgressProviderContext, {
  CourseProgressProviderInterface,
} from "../contexes/courseProgressProviderContext"
import { Snackbar } from "@material-ui/core"
import { PointsByGroup } from "../modelTypes"
import { getUserCourseData } from "../services/courseProgressService"

import { promisify } from "util"

import { w3cwebsocket as W3CWebSocket } from "websocket"
// import { client as WebSocketClient }from "websocket"

interface CourseProgressProviderProps {
  accessToken: string
  courseId: string
}

type MessageType =
  | "PROGRESS_UPDATED"
  | "PEER_REVIEW_REVEIVED"
  | "QUIZ_CONFIRMED"
  | "QUIZ_REJECTED"

export const CourseProgressProvider: React.FunctionComponent<
  CourseProgressProviderProps
> = ({ accessToken, courseId, children }) => {
  const [data, setData] = useState<any>([])
  const [updateQuiz, setUpdateQuiz] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [moocfiVerified, setMoocfiVerified] = useState(false)
  const [quizzesVerified, setQuizzesVerified] = useState(false)
  const [moocfiClient, setMoocfiClient] = useState<W3CWebSocket | undefined>()
  const [quizzesClient, setQuizzesClient] = useState<W3CWebSocket | undefined>()
  const [messages, setMessage] = useState("")

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (moocfiClient && !moocfiVerified) {
      moocfiClient.send(JSON.stringify({ accessToken, courseId }))
      setMoocfiVerified(true)
      console.log("Connected to moocfi")
    }
    if (quizzesClient && !quizzesVerified) {
      quizzesClient.send(JSON.stringify({ accessToken, courseId }))
      setQuizzesVerified(true)
      console.log("Connected to quizzes")
    }
  })

  const init = async () => {
    await fetchProgressData()
    setQuizzesClient(
      await connect("ws://localhost:7000").catch(() => undefined),
    )
    setMoocfiClient(await connect("ws://localhost:9000").catch(() => undefined))
  }

  const connect = (host: string): Promise<W3CWebSocket> => {
    return new Promise((resolve: any, reject: any) => {
      const client = new W3CWebSocket(host, "echo-protocol")
      client.onmessage = onMessage
      client.onclose = (e: any) => {}
      client.onopen = () => {
        resolve(client)
      }
      client.onerror = err => {
        reject(err)
      }
    })
  }

  const onMessage = (message: any) => {
    const data = JSON.parse(message.data)
    if (data instanceof Object) {
      switch (data.type) {
        case "PROGRESS_UPDATED":
          fetchProgressData()
          break
        case "PEER_REVIEW_RECEIVED":
          setUpdateQuiz({ ...updateQuiz, [data.message]: true })
          setMessage("You have received a new peer review")
          break
        case "QUIZ_CONFIRMED":
          setUpdateQuiz({ ...updateQuiz, [data.message]: true })
          setMessage("Your answer was confirmed!")
          break
      }
    }
  }

  const fetchProgressData = async () => {
    try {
      setLoading(true)
      const data = await getUserCourseData(courseId, accessToken)
      setData(data)
      setLoading(false)
    } catch (error) {
      setError(true)
      setLoading(false)
    }
  }

  const refreshProgress = () => {
    setLoading(true)
    setTimeout(() => fetchProgressData(), 1000)
  }

  const quizUpdated = (id: string) => {
    setUpdateQuiz({ ...updateQuiz, [id]: false })
  }

  const value: CourseProgressProviderInterface = {
    error,
    loading,
    refreshProgress,
    updateQuiz,
    quizUpdated,
    userCourseProgress: data,
    requiredActions: data.requiredActions,
  }

  return (
    <CourseProgressProviderContext.Provider value={value}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!messages}
        onClose={() => setMessage("")}
        autoHideDuration={6000}
        message={messages}
      />
      {children}
    </CourseProgressProviderContext.Provider>
  )
}

export const injectCourseProgress = <P extends CourseProgressProviderInterface>(
  Component: React.FunctionComponent<P> | React.ComponentType<P>,
): React.FunctionComponent<P & CourseProgressProviderInterface> => (
  props: P,
) => {
  const injectProps = useContext(CourseProgressProviderContext)
  return <Component {...props} {...injectProps} />
}
