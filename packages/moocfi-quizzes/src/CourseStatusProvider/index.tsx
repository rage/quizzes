import * as React from "react"
import { useContext, useEffect, useRef, useState } from "react"
import {
  CourseProgressProviderContext,
  CourseProgressProviderInterface,
  CourseStatusProviderContext,
  CourseStatusProviderInterface,
  ProgressData,
  ExerciseCompletion,
  RequiredAction,
  Exercise,
  ProgressResponse,
  ExerciseCompletionsBySection,
  CourseResponse,
} from "../contexes/courseStatusProviderContext"
import { PointsByGroup } from "../modelTypes"
import { languageOptions } from "../utils/languages"
import { ToastContainer, toast, TypeOptions } from "react-toastify"
import {
  // getCompletion,
  getUserCourseData,
} from "../services/courseProgressService"

import "react-toastify/dist/ReactToastify.css"

interface CourseStatusProviderProps {
  accessToken: string
  courseId: string
  languageId: string
}

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
        /*const completionData = await getCompletion(courseId, accessToken)
        progressData.currentUser.completions =
          completionData.currentUser.completions*/
        const data = transformData(
          progressData.currentUser,
          progressData.course,
        )
        setData(data)
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
        console.log(error)
        console.log("Could not fetch course progress data")
        notifySticky(
          languageOptions[languageId].error.progressFetchError,
          "error",
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
      notifySticky(message, "error")
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
            position="top-left"
          />
          <ToastContainer
            enableMultiContainer
            newestOnTop={false}
            hideProgressBar
            containerId={"regular"}
            position="top-right"
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

const transformData = (
  data: ProgressResponse,
  courseData: CourseResponse,
): ProgressData => {
  const courseProgress = data.user_course_progressess
  const completed = data.completions.length > 0
  let points_to_pass = 0
  let n_points = 0
  let max_points = 0
  let exercise_completions = 0
  let total_exercises = 0
  let distinctActions = new Set()
  let progress: PointsByGroup[] = []
  let exercises: Exercise[] = []
  const answers: ExerciseCompletion[] = []
  const exercise_completions_by_section: ExerciseCompletionsBySection[] = []
  if (courseProgress) {
    n_points = courseProgress.n_points
    progress = courseProgress.progress
    exercises = courseProgress.course.exercises
    points_to_pass = courseProgress.course.points_needed || 0
    for (const exercise of courseProgress.course.exercises) {
      let section = exercise_completions_by_section.find(
        (sec: any) =>
          sec.part === exercise.part && sec.section === exercise.section,
      )
      if (!section) {
        section = {
          part: exercise.part,
          section: exercise.section,
          exercises_total: 0,
          exercises_completed: 0,
          required_actions: [],
        }
        exercise_completions_by_section.push(section)
      }
      section.exercises_total += 1
      const answer = exercise.exercise_completions[0]
      if (answer) {
        section.exercises_completed = answer.completed
          ? section.exercises_completed + 1
          : section.exercises_completed
        const requiredActions = answer.exercise_completion_required_actions.map(
          rao => rao.value,
        )
        section.required_actions = section.required_actions.concat(
          requiredActions,
        )
        requiredActions.forEach(ra => distinctActions.add(ra))
        exercise_completions = answer.completed
          ? exercise_completions + 1
          : exercise_completions
        answers.push(answer)
      }
    }
  }
  const required_actions = Array.from(distinctActions) as RequiredAction[]

  if (courseData) {
    total_exercises = courseData.exercises.filter(ex => ex.part !== 0).length
    max_points = courseData.exercises
      .filter(ex => ex.part !== 0)
      .map(ex => ex.max_points)
      .reduce((a, b) => a + b, 0)
  }

  return {
    completed,
    points_to_pass,
    n_points,
    max_points,
    exercise_completions,
    total_exercises,
    required_actions,
    progress,
    exercises,
    answers,
    exercise_completions_by_section,
  }
}
