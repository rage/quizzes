import React, { useEffect } from "react"
import { fetchQuiz, fetchCourseById } from "../../services/quizzes"
import { initializedEditor } from "../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import SaveButton from "../SaveButton"
import { normalizedQuiz } from "../../schemas"
import { normalize } from "normalizr"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import QuizEditForms from "../QuizEditForms"
import _ from "lodash"
import QuizTitle from "./QuizTitleContainer"
import usePromise from "react-use-promise"
import { TabText, TabTextLoading, TabTextError } from "./TabHeaders"

const EditPage = () => {
  const router = useRouter()
  const quizId: string = router.query.quizId?.toString() ?? ""

  const [quizData, error] = usePromise(() => fetchQuiz(quizId), [quizId])
  const [course, courseError] = usePromise(
    () => fetchCourseById(quizData?.courseId ?? ""),
    [quizData],
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (!quizData) {
      return
    }
    const quiz = quizData
    const storeState = normalize(quiz, normalizedQuiz)
    const normalizedData = {
      quizzes: storeState.entities.quizzes ?? {},
      items: storeState.entities.items ?? {},
      options: storeState.entities.options ?? {},
      result: storeState.result,
    }
    dispatch(initializedEditor(normalizedData, quiz))
  }, [quizData])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quizData?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Edit quiz",
    },
  ])

  if (error || courseError) {
    return (
      <>
        <TabTextError />
        <div>Something went wrong</div>
      </>
    )
  }

  if (!quizData || !course) {
    return (
      <>
        <TabTextLoading />
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
      <TabText text={`Editing ${quizData?.title}`} />
      <SaveButton />
      <QuizTitle quiz={quizData} course={course} />
      <QuizEditForms />
    </>
  )
}

export default EditPage
