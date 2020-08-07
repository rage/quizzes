import React, { useEffect } from "react"
import QuizEditForms from "../../../../components/QuizEditForms"
import { Typography } from "@material-ui/core"
import SaveButton from "../../../../components/SaveButton"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { createdNewQuiz } from "../../../../store/editor/editorActions"
import Head from "next/head"

const NewQuiz = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const courseId: string = router.query.courseId?.toString() ?? ""
  useEffect(() => {
    dispatch(createdNewQuiz(courseId))
  }, [])
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${courseId}`,
      href: "/courses/[id]",
    },
    { label: "New Quiz" },
  ])
  return (
    <>
      <div>
        <Head>
          <title>Creating new quiz</title>
          <meta
            name="quizzes"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>
      <SaveButton />
      <Typography variant="h1">Editing new quiz</Typography>
      <QuizEditForms />
    </>
  )
}

export default NewQuiz
