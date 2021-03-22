import * as React from "react"
import { useEffect, useRef, useState } from "react"
import {
  CourseProgressProviderInterface,
  ProgressData,
  ExerciseCompletion,
  RequiredAction,
  Exercise,
  ProgressResponse,
  ExerciseCompletionsBySection,
  CourseResponse,
  CourseProgressProvider,
  useCourseProgressState,
} from "../contexes/courseProgressProviderContext"
import { PointsByGroup } from "../modelTypes"
import { languageOptions } from "../utils/languages"
import { ToastContainer, toast, TypeOptions } from "react-toastify"
import { getUserCourseData } from "../services/courseProgressService"

import "react-toastify/dist/ReactToastify.css"

import {
  CourseStatusProviderContext,
  CourseStatusProviderInterface,
} from "../contexes/courseStatusProviderContext"

interface CourseStatusProviderProps {
  accessToken: string
  courseId: string
  languageId: string
}

export const CourseStatusProvider: React.FunctionComponent<CourseStatusProviderProps> = ({
  children,
  ...props
}) => {
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

  const [moocfiClient, setMoocfiClient] = useState<WebSocket | undefined>()
  const [quizzesClient, setQuizzesClient] = useState<WebSocket | undefined>()

  const shouldFetch =
    accessToken !== prevProps.current.accessToken ||
    courseId !== prevProps.current.courseId ||
    languageId !== prevProps.current.languageId

  useEffect(() => {
    if (accessToken && courseId) {
      if (shouldFetch) {
        prevProps.current = props
        fetchProgressData()
      }
    } else {
      logout()
    }
  })

  const fetchProgressData = async () => {
    try {
      const progressData = await getUserCourseData(courseId, accessToken)

      const data = transformData(progressData.currentUser, progressData.course)
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

  const notifySticky = (message: string, type?: TypeOptions) =>
    toast(message, { containerId: "sticky", type })

  const quizUpdated = (id: string) => {
    setUpdateQuiz({ ...updateQuiz, [id]: false })
  }

  const progress: CourseProgressProviderInterface = {
    error,
    loading,
    courseProgressData: data,
    courseId,
    accessToken,
  }

  const status: CourseStatusProviderInterface = {
    updateQuiz,
    quizUpdated,
  }

  return (
    <CourseProgressProvider courseProgress={progress}>
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
    </CourseProgressProvider>
  )
}

export const injectCourseProgress = <P extends CourseProgressProviderInterface>(
  Component: React.FunctionComponent<P> | React.ComponentType<P>,
): React.FunctionComponent<P & CourseProgressProviderInterface> => (
  props: P,
) => {
  // initial course progress
  const { state } = useCourseProgressState()
  // course progress with updates
  const { courseId, accessToken, ...rest } = state
  const [injectProps, setInjectProps] = useState(rest)

  // Ref for the wrapped element
  const ref: any = useRef<HTMLElement>()
  const rootMargin = "0px"
  const outOfViewThreshold = 10

  const refetchData = async () => {
    if (courseId && accessToken) {
      // fetch data
      setInjectProps({ ...injectProps, loading: true })
      const progressData = await getUserCourseData(courseId, accessToken)
      const data = transformData(progressData.currentUser, progressData.course)
      setInjectProps({
        ...injectProps,
        courseProgressData: data,
        loading: false,
      })
    }
  }

  /**
   * Triggers a refetch of progress after given time interval
   *  */

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          const entryTarget = entry.target as HTMLElement

          // a time stamp has been marked
          if (entryTarget.dataset.lastInteractionStarted) {
            // check if it has been long enough
            const secondsOutOfView =
              (performance.now() -
                Number.parseFloat(entryTarget.dataset.lastInteractionStarted)) /
              1000

            if (secondsOutOfView >= outOfViewThreshold) {
              await refetchData()
            }

            // reset off view counter
            entryTarget.dataset.lastInteractionStarted = performance
              .now()
              .toString()
          } else {
            // no stamp, so mark when this intersection started
            entryTarget.dataset.lastInteractionStarted = performance
              .now()
              .toString()
          }
        }
      },
      {
        rootMargin,
      },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer.unobserve(ref.current)
    }
  }, [])

  return (
    <div ref={ref}>
      {!state.loading && <Component {...props} {...injectProps} />}
    </div>
  )
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
    max_points = courseProgress.max_points
    progress = courseProgress.progress
    exercises = courseProgress.course.exercises
    points_to_pass = courseProgress.course.points_needed || 0
    total_exercises += exercises.length
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
        if (answer.completed) {
          section.exercises_completed += 1
          exercise_completions += 1
        } else {
          const requiredActions = answer.exercise_completion_required_actions.map(
            rao => rao.value,
          )
          section.required_actions = section.required_actions.concat(
            requiredActions,
          )
          requiredActions.forEach(ra => distinctActions.add(ra))
        }
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

  n_points = Math.floor(n_points * 100) / 100

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
