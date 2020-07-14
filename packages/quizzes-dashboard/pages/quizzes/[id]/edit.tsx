import React, { useEffect } from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { initializedEditor } from "../../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import SaveButton from "../../../components/SaveButton"
import { normalizedQuiz } from "../../../schemas"
import { normalize, denormalize } from "normalizr"
import useSWR from "swr"
import { withRouter } from "next/router"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import QuizEditForms from "../../../components/QuizEditForms"
import { useTypedSelector } from "../../../store/store"
import _ from "lodash"

const EditPage = ({ router }: any) => {
  const id = router.query.id
  const { data, error } = useSWR(id, fetchQuiz)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!data) {
      return
    }
    const quiz = data
    const storeState = normalize(quiz, normalizedQuiz)
    const normalizedData = {
      quizzes: storeState.entities.quizzes ?? {},
      items: storeState.entities.items ?? {},
      options: storeState.entities.options ?? {},
      result: storeState.result,
    }
    dispatch(initializedEditor(normalizedData, quiz))
  }, [data])
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${data?.courseId}`,
      href: "/courses/[id]",
    },
    { label: "Quiz" },
  ])

  if (error) {
    return <div>Something went wrong</div>
  }

  return (
    <>
      <SaveButton />
      <Typography variant="h1">Editing quiz</Typography>
      <QuizEditForms />
    </>
  )
}

export default withRouter(EditPage)
