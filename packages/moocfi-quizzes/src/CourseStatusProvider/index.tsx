import * as React from "react"
import { useContext, useEffect, useRef, useState } from "react"
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
import { languageOptions } from "../utils/languages"
import { ToastContainer, toast, TypeOptions } from "react-toastify"
import {
  getCompletion,
  getUserCourseData,
} from "../services/courseProgressService"

import "react-toastify/dist/ReactToastify.css"

interface CourseStatusProviderProps {
  accessToken: string
  courseId: string
  languageId: string
}

const ToastType = toast.TYPE

enum MessageType {
  PROGRESS_UPDATED = "PROGRESS_UPDATED",
  PEER_REVIEW_RECEIVED = "PEER_REVIEW_RECEIVED",
  QUIZ_CONFIRMED = "QUIZ_CONFIRMED",
  QUIZ_REJECTED = "QUIZ_REJECTED",
  COURSE_CONFIRMED = "COURSE_CONFIRMED",
}

enum ConnectionStatus {
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
  DISCONNECTED = "DISCONNECTED",
}

interface Message {
  type: MessageType
  payload: string
}

const isMessage = (message: any): message is Message => {
  return "type" in message && message.type in MessageType
}

export const CourseStatusProvider: React.FunctionComponent<CourseStatusProviderProps> = React.memo(
  ({ children, ...props }) => {
    const { accessToken, courseId, languageId } = props

    const prevProps = useRef({
      accessToken: "",
      courseId: "",
      languageId: "",
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [updateQuiz, setUpdateQuiz] = useState({})
    const [data, setData] = useState<ProgressData | undefined>()

    const [moocfiStatus, setMoocfiStatus] = useState<ConnectionStatus>(
      ConnectionStatus.DISCONNECTED,
    )
    const [quizzesStatus, setQuizzesStatus] = useState<ConnectionStatus>(
      ConnectionStatus.DISCONNECTED,
    )
    const [moocfiClient, setMoocfiClient] = useState<WebSocket | undefined>()
    const [quizzesClient, setQuizzesClient] = useState<WebSocket | undefined>()

    const shouldFetch =
      accessToken !== prevProps.current.accessToken ||
      courseId !== prevProps.current.courseId ||
      languageId !== prevProps.current.languageId
    const shouldConnectMoocfi =
      !loading && !error && moocfiStatus === ConnectionStatus.DISCONNECTED
    const shouldConnectQuizzes =
      !loading && !error && quizzesStatus === ConnectionStatus.DISCONNECTED

    useEffect(() => {
      if (accessToken && courseId) {
        if (shouldFetch) {
          prevProps.current = props
          fetchProgressData()
        }
        /*if (shouldConnectMoocfi) {
        connect(
          "wss://www.mooc.fi/ws",
          setMoocfiClient,
          setMoocfiStatus,
        )
      }
      if (shouldConnectQuizzes) {
        connect(
          "wss://quizzes.mooc.fi/ws",
          setQuizzesClient,
          setQuizzesStatus,
        )
      }*/
      } else {
        logout()
      }
    })

    const fetchProgressData = async () => {
      try {
        const progressData = await getUserCourseData(courseId, accessToken)
        const completionData = await getCompletion(courseId, accessToken)
        progressData.currentUser.completions =
          completionData.currentUser.completions
        const data = transformData(progressData)
        setData(data)
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
        console.log(error)
        console.log("Could not fetch course progress data")
        notifySticky(
          languageOptions[languageId].error.progressFetchError,
          ToastType.ERROR,
        )
      }
    }

    const connect = async (
      host: string,
      setClient: React.Dispatch<React.SetStateAction<WebSocket | undefined>>,
      setStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>,
    ) => {
      setStatus(ConnectionStatus.CONNECTING)
      try {
        const client: WebSocket = await new Promise(
          (resolve: any, reject: any) => {
            const client = new WebSocket(host, "echo-protocol")
            client.onopen = () => {
              resolve(client)
            }
            client.onerror = err => {
              reject(err)
            }
          },
        )
        client.onmessage = onMessage
        client.onerror = e => reconnect(host, setStatus)
        client.onclose = e => reconnect(host, setStatus)
        client.send(JSON.stringify({ accessToken, courseId }))
        setClient(client)
        setStatus(ConnectionStatus.CONNECTED)
        console.log(`connected to ${host}`)
      } catch (error) {
        reconnect(host, setStatus)
      }
    }

    const reconnect = (
      host: string,
      setStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>,
    ) => {
      console.log(`could not connect to ${host}, attempting to reconnect...`)
      setTimeout(() => setStatus(ConnectionStatus.DISCONNECTED), 10000)
    }

    const logout = () => {
      setLoading(true)
      setError(false)
      setData(undefined)
      moocfiClient && moocfiClient.close()
      quizzesClient && quizzesClient.close()
      setMoocfiClient(undefined)
      setQuizzesClient(undefined)
      prevProps.current = {
        accessToken: "",
        courseId: "",
        languageId: "",
      }
    }

    const onMessage = (inbound: any) => {
      const message = JSON.parse(inbound.data)
      if (isMessage(message)) {
        switch (message.type) {
          case MessageType.PROGRESS_UPDATED:
            fetchProgressData()
            break
          case MessageType.PEER_REVIEW_RECEIVED:
            setUpdateQuiz({ ...updateQuiz, [message.payload]: true })
            /*notifyRegular(
            languageOptions[languageId].receivedPeerReviews.peerReviewReceived,
            ToastType.SUCCESS,
          )*/
            break
          case MessageType.QUIZ_CONFIRMED:
            setUpdateQuiz({ ...updateQuiz, [message.payload]: true })
            /*notifyRegular(
            languageOptions[languageId].general.answerConfirmed,
            ToastType.SUCCESS,
          )
          notifyRegular(
            languageOptions[languageId].general.progressUpdated,
            ToastType.SUCCESS,
          )*/
            break
          case MessageType.QUIZ_REJECTED:
            setUpdateQuiz({ ...updateQuiz, [message.payload]: true })
            break
          case MessageType.COURSE_CONFIRMED:
            fetchProgressData()
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

    const notifyError = (message: string) => {
      notifySticky(message, ToastType.ERROR)
    }

    const progress: CourseProgressProviderInterface = {
      error,
      loading,
      // notifyError,
      courseProgressData: data,
    }

    const status: CourseStatusProviderInterface = {
      updateQuiz,
      quizUpdated,
      // notifyError,
    }

    return (
      <CourseProgressProviderContext.Provider value={progress}>
        <CourseStatusProviderContext.Provider value={status}>
          <ToastContainer
            enableMultiContainer
            newestOnTop={false}
            autoClose={false}
            hideProgressBar
            containerId={"sticky"}
            position={toast.POSITION.TOP_LEFT}
          />
          <ToastContainer
            enableMultiContainer
            newestOnTop={false}
            hideProgressBar
            containerId={"regular"}
            position={toast.POSITION.TOP_RIGHT}
          />
          {children}
        </CourseStatusProviderContext.Provider>
      </CourseProgressProviderContext.Provider>
    )
  },
)

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
  let distinctActions = new Set()
  const progressByGroup: ProgressByGroup = {}
  // const exercisesByPart: ExercisesByPart = {}
  // const answersByPart: AnswersByPart = {}
  let exercise_completions_by_section: any
  if (courseProgress) {
    n_points = courseProgress.n_points
    max_points = courseProgress.max_points
    exercise_completions_by_section =
      courseProgress.exercise_completions_by_section
    for (const groupProgress of courseProgress.progress) {
      progressByGroup[groupProgress.group] = groupProgress
    }
  }
  const required_actions = Array.from(distinctActions) as RequiredAction[]

  return {
    completed,
    points_to_pass,
    n_points,
    max_points,
    exercise_completions,
    total_exercises,
    required_actions,
    progressByGroup,
    //exercisesByPart,
    //answersByPart,
    exercise_completions_by_section,
  }
}

/*const transformData = (data: any): ProgressData => {
  const courseProgress = data.currentUser.user_course_progresses[0]
  const completed = data.currentUser.completions.length > 0
  let points_to_pass = 0
  let n_points
  let max_points
  let exercise_completions = 0
  let total_exercises = 0
  let distinctActions = new Set()
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
                distinctActions.add(action.value)
                return action.value
              }
            }),
          },
        ]
      }
    }
  }
  const required_actions = Array.from(distinctActions) as RequiredAction[]

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
}*/
