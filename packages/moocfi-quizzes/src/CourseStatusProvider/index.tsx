import * as React from "react"
import { useContext, useEffect, useState } from "react"
import {
  CourseProgressProviderContext,
  CourseProgressProviderInterface,
  CourseStatusProviderContext,
  CourseStatusProviderInterface,
  ProgressData,
  ProgressByGroup,
  ExercisesByPart,
  AnswersByPart,
  RequiredAction,
} from "../contexes/courseStatusProviderContext"
import { ToastContainer, toast, TypeOptions } from "react-toastify"
import { getUserCourseData } from "../services/courseProgressService"

import "react-toastify/dist/ReactToastify.css"

import { w3cwebsocket as W3CWebSocket } from "websocket"

interface CourseProgressProviderProps {
  accessToken: string
  courseId: string
}

const ToastTypes = toast.TYPE

enum MessageType {
  PROGRESS_UPDATED = "PROGRESS_UPDATED",
  PEER_REVIEW_RECEIVED = "PEER_REVIEW_RECEIVED",
  QUIZ_CONFIRMED = "QUIZ_CONFIRMED",
  QUIZ_REJECTED = "QUIZ_REJECTED",
}

interface Message {
  type: MessageType
  payload: string
}

const isMessage = (message: any): message is Message => {
  return "type" in message && message.type in MessageType
}

export const CourseStatusProvider: React.FunctionComponent<
  CourseProgressProviderProps
> = ({ accessToken, courseId, children }) => {
  const [data, setData] = useState<ProgressData>()
  const [updateQuiz, setUpdateQuiz] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [moocfiVerified, setMoocfiVerified] = useState(false)
  const [quizzesVerified, setQuizzesVerified] = useState(false)
  const [moocfiClient, setMoocfiClient] = useState<W3CWebSocket | undefined>()
  const [quizzesClient, setQuizzesClient] = useState<W3CWebSocket | undefined>()

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

  const fetchProgressData = async () => {
    try {
      setLoading(true)
      const data = transformData(await getUserCourseData(courseId, accessToken))
      setData(data)
      setLoading(false)
    } catch (error) {
      console.log("Could not fetch course progress data")
      console.log(error)
      setError(true)
      setLoading(false)
      notifySticky("Could not fetch course progress data", ToastTypes.ERROR)
    }
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

  const onMessage = (inbound: any) => {
    const message = JSON.parse(inbound.data)
    if (isMessage(message)) {
      switch (message.type) {
        case "PROGRESS_UPDATED":
          fetchProgressData()
          notifyRegular("Course progress updated", ToastTypes.SUCCESS)
          break
        case "PEER_REVIEW_RECEIVED":
          setUpdateQuiz({ ...updateQuiz, [message.payload]: true })
          notifyRegular(
            "You have received a new peer review",
            ToastTypes.SUCCESS,
          )
          break
        case "QUIZ_CONFIRMED":
          setUpdateQuiz({ ...updateQuiz, [message.payload]: true })
          notifyRegular("Your answer was confirmed!", ToastTypes.SUCCESS)
          break
      }
    }
  }

  const notifyRegular = (message: string, type?: TypeOptions) =>
    toast(message, { containerId: "regular", type })
  const notifySticky = (message: string, type?: TypeOptions) =>
    toast(message, { containerId: "sticky", type })

  const quizUpdated = (id: string) => {
    setUpdateQuiz({ ...updateQuiz, [id]: false })
  }

  const notifyError = (message: string) =>
    notifySticky(message, ToastTypes.ERROR)

  const progress: CourseProgressProviderInterface = {
    error,
    loading,
    notifyError,
    courseProgressData: data,
  }

  const status: CourseStatusProviderInterface = {
    updateQuiz,
    quizUpdated,
    notifyError,
  }

  return (
    <CourseProgressProviderContext.Provider value={progress}>
      <CourseStatusProviderContext.Provider value={status}>
        <ToastContainer
          enableMultiContainer
          newestOnTop
          autoClose={false}
          hideProgressBar
          containerId={"sticky"}
          position={toast.POSITION.TOP_LEFT}
        />
        <ToastContainer
          enableMultiContainer
          newestOnTop
          hideProgressBar
          containerId={"regular"}
          position={toast.POSITION.TOP_RIGHT}
        />
        {children}
      </CourseStatusProviderContext.Provider>
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

const transformData = (data: any): ProgressData => {
  const courseProgress = data.currentUser.user_course_progresses[0]
  const completed = data.currentUser.completions.length > 0
  let points_to_pass = 0
  let n_points
  let max_points
  let exercise_completions = 0
  let total_exercises = 0
  let actions = new Set()
  const progressByGroup: ProgressByGroup = {}
  const exercisesByPart: ExercisesByPart = {}
  const answersByPart: AnswersByPart = {}
  if (courseProgress) {
    n_points = courseProgress.n_points
    max_points = courseProgress.max_points
    for (const groupProgress of courseProgress.progress) {
      progressByGroup[groupProgress.group] = groupProgress
    }
    const exerciseData = courseProgress.course
    points_to_pass = exerciseData.points_needed || 0
    for (const exercise of exerciseData.exercises) {
      total_exercises += 1
      const partExercises = exercisesByPart[exercise.part] || []
      exercisesByPart[exercise.part] = [...partExercises, exercise]
    }
    for (const exercise of exerciseData.withAnswer) {
      const answer = exercise.exercise_completions[0]
      if (answer) {
        exercise_completions += 1
        const partAnswers = answersByPart[exercise.part] || []
        answersByPart[exercise.part] = [
          ...partAnswers,
          {
            exercise_id: exercise.id,
            exercise_quizzes_id: exercise.custom_id,
            part: exercise.part,
            section: exercise.section,
            n_points: answer.n_points,
            completed: answer.completed,
            required_actions: answer.required_actions.map((action: any) => {
              if (action.value in RequiredAction) {
                actions.add(action.value)
                return action.value
              }
            }),
          },
        ]
      }
    }
  }
  const required_actions = Array.from(actions) as RequiredAction[]

  return {
    completed,
    points_to_pass,
    n_points,
    max_points,
    exercise_completions,
    total_exercises,
    required_actions,
    progressByGroup,
    exercisesByPart,
    answersByPart,
  }
}
