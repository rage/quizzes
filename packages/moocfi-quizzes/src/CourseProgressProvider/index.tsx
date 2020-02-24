import * as React from "react"
import { useContext, useEffect, useState } from "react"
import CourseProgressProviderContext, {
  CourseProgressProviderInterface,
} from "../contexes/courseProgressProviderContext"
import { PointsByGroup } from "../modelTypes"
import { getUserCourseData } from "../services/courseProgressService"

import { promisify } from "util"

import { w3cwebsocket as W3CWebSocket } from "websocket"
// import { client as WebSocketClient }from "websocket"

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
  const [verified, setVerified] = useState(false)
  const [client, setClient] = useState<W3CWebSocket>()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (client && !verified) {
      client.send(JSON.stringify([accessToken, courseId]))
      setVerified(true)
    }
  })

  const connect = (): Promise<W3CWebSocket> => {
    return new Promise((resolve: any, reject: any) => {
      const client = new W3CWebSocket("ws://localhost:9000", "echo-protocol")
      client.onmessage = (message: any) => {
        if (message.data === "ping") {
          fetchProgressData()
          setUpdated(true)
          setUpdated(false)
        }
      }

      client.onclose = (e: any) => {}
      client.onopen = function() {
        resolve(client)
      }
      client.onerror = function(err) {
        reject(err)
      }
    })
  }

  const init = async () => {
    setClient(await connect())
    await fetchProgressData()
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

  const value = {
    refreshProgress,
    updated,
    error,
    loading,
    userCourseProgress: data.userCourseProgress,
    requiredActions: data.requiredActions,
  }

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
