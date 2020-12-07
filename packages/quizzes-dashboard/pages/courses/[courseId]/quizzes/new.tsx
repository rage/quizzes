import React, { useEffect } from "react"
import QuizEditForms from "../../../../components/QuizEditForms"
import { Typography } from "@material-ui/core"
import SaveButton from "../../../../components/SaveButton"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { createdNewQuiz } from "../../../../store/editor/editorActions"
import Head from "next/head"
import usePromise from "react-use-promise"
import { fetchCourseById } from "../../../../services/quizzes"

const NewQuiz = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const courseId: string = router.query.courseId?.toString() ?? ""
  const [course, error] = usePromise(() => fetchCourseById(courseId), [
    courseId,
  ])
  useEffect(() => {
    dispatch(createdNewQuiz(courseId))
  }, [])
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${courseId}`,
      href: "/courses/[courseId]/[...page]",
    },
    { label: "New Quiz" },
  ])
  return (
    <>
      <div>
        <Head>
          <title>Creating new quiz | Quizzes</title>
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
