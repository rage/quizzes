import React, { useEffect } from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { initializedEditor } from "../../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import SaveButton from "../../../components/SaveButton"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"
import useSWR from "swr"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../../hooks/useBreadcrumbs"
import QuizEditForms from "../../../components/QuizEditForms"
import _ from "lodash"
import Link from "next/link"

const EditPage = () => {
  const router = useRouter()
  const quizId: string = router.query.quizId?.toString() ?? ""
  const { data, error } = useSWR(quizId, fetchQuiz)
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
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz Overview",
      as: `/quizzes/${data?.id}/overview`,
      href: "/quizzes/[quizzesId]/overview",
    },
    { label: "Edit" },
  ])

  if (error) {
    return <div>Something went wrong</div>
  }

  return (
    <>
      <Link
        href={{
          pathname: "/quizzes/[quizId]/answers/requiringAttention",
        }}
        as={`/quizzes/${quizId}/answers/requiringAttention`}
      >
        <a>
          <Typography>Answers Requiring Attention</Typography>
        </a>
      </Link>
      <Link
        href={{
          pathname: "/quizzes/[quizId]/answers/all",
        }}
        as={`/quizzes/${quizId}/answers/all`}
      >
        <a>
          <Typography>All Answers</Typography>
        </a>
      </Link>
      <SaveButton />
      <Typography variant="h1">Editing quiz</Typography>
      <QuizEditForms />
    </>
  )
}

export default EditPage
