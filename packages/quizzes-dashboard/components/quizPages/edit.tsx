import React, { useEffect } from "react"
import { fetchQuiz } from "../../services/quizzes"
import { initializedEditor } from "../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import SaveButton from "../SaveButton"
import { normalizedQuiz } from "../../schemas"
import { normalize } from "normalizr"
import useSWR from "swr"
import { useRouter } from "next/router"
import useBreadcrumbs from "../../hooks/useBreadcrumbs"
import QuizEditForms from "../QuizEditForms"
import _ from "lodash"
import Head from "next/head"
import TabNavigator from "../TabNavigator"

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
      label: "Edit quiz",
    },
  ])

  if (error) {
    return (
      <>
        <div>
          <Head>
            <title>womp womp... | Quizzes</title>
            <meta
              name="quizzes"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
        </div>
        <div>Something went wrong</div>
      </>
    )
  }

  return (
    <>
      <div>
        <Head>
          <title>Editing {data?.title} | Quizzes</title>
          <meta
            name="quizzes"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>
      <SaveButton />
      <Typography variant="h1">Editing quiz</Typography>
      <QuizEditForms />
    </>
  )
}

export default EditPage
