import * as React from "react"
import { useContext, useEffect, useState } from "react"
import CourseProgressProviderContext, {
  CourseProgressProviderInterface,
} from "../contexes/courseProgressProviderContext"
import { PointsByGroup } from "../modelTypes"
import { getUserCourseData } from "../services/courseProgressService"

import { promisify } from "util"

import { w3cwebsocket as W3CWebSocket } from "websocket"

const client = new W3CWebSocket("ws://localhost:9000", "echo-protocol")

client.onopen = () => {
  console.log("WebSocket Client Connected")
  const sendToken = () => {
    if (client.readyState === 1) {
      client.send(JSON.stringify([accessToken, courseId]))
    }
  }
  sendToken()
}

interface CourseProgressProviderProps {
  accessToken: string
  courseId: string
}

export const CourseProgressProvider: React.FunctionComponent<
  CourseProgressProviderProps
> = ({ accessToken, courseId, children }) => {
  const [data, setData] = useState<any>([])
  const [updated, setUpdated] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState(10)

  useEffect(() => {
    console.log("MOUNT ", client)
  }, [])

  const init = async () => {
    client.onopen = () => {
      console.log("WebSocket Client Connected")
      const sendToken = () => {
        if (client.readyState === 1) {
          client.send(JSON.stringify([accessToken, courseId]))
        }
      }
      sendToken()
    }
    const connect = promisify(client.onopen)
    await connect()
    await fetchProgressData()
  }

  /*useEffect(() => {
    console.log("MOUNT ", client)
    /*client.onopen = () => {
      console.log("WebSocket Client Connected")
      const sendToken = () => {
        if (client.readyState === 1) {
          client.send(JSON.stringify([accessToken, courseId]))
        }
      }
      sendToken()
    }*/
  /*setTimeout(() => {
    if (client.readyState === 1) {
      console.log(client)
      client.send(JSON.stringify([accessToken, courseId]))
    } else {
      console.log("else")
      setTimer(10)
    }
  }, timer)
  fetchProgressData()
}, [])*/

  client.onmessage = message => {
    if (message.data === "ping") {
      fetchProgressData()
      setUpdated(true)
      setUpdated(false)
    }
  }

  client.onclose = e => {}

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

  const value = {
    refreshProgress,
    updated,
    error,
    loading,
    userCourseProgress: data.userCourseProgress,
    requiredActions: data.requiredActions,
  }
  console.log(client)
  return (
    <CourseProgressProviderContext.Provider value={value}>
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
