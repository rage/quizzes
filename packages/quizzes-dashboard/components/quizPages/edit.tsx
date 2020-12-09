import React, { useEffect } from "react"
import { initializedEditor } from "../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import SaveButton from "../SaveButton"
import { normalizedQuiz } from "../../schemas"
import { normalize } from "normalizr"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import QuizEditForms from "../QuizEditForms"
import _ from "lodash"
import QuizTitle from "./QuizTitleContainer"
import { TabText } from "./TabHeaders"
import { IQuizTabProps } from "./answers/types"

const EditPage = ({ quiz, course }: IQuizTabProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!quiz) {
      return
    }
    const storeState = normalize(quiz, normalizedQuiz)
    const normalizedData = {
      quizzes: storeState.entities.quizzes ?? {},
      items: storeState.entities.items ?? {},
      options: storeState.entities.options ?? {},
      result: storeState.result,
      peerReviews: storeState.entities.peerReviews ?? {},
      questions: storeState.entities.questions ?? {},
    }
    dispatch(initializedEditor(normalizedData, quiz))
  }, [quiz])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${quiz?.courseId}/listing`,
      href: "/courses/[courseId]/[...page]",
    },
    {
      label: `${quiz ? quiz.title : ""}`,
    },
  ])

  return (
    <>
      <TabText text={`Editing ${quiz?.title}`} />
      <SaveButton />
      {quiz && <QuizTitle quiz={quiz} />}
      <QuizEditForms />
    </>
  )
}

export default EditPage
