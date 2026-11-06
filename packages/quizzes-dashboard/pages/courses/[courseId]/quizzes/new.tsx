import React, { useEffect } from "react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import useSWR from "swr"

import { Typography } from "@mui/material"

import QuizEditForms from "../../../../components/QuizEditForms"
import SaveButton from "../../../../components/SaveButton"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { fetchCourseById } from "../../../../services/quizzes"
import { createdNewQuiz } from "../../../../store/editor/editorActions"

const NewQuiz = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const courseId: string = router.query.courseId?.toString() ?? ""
  const { data: course } = useSWR(
    courseId ? ["courseById", courseId] : null,
    ([, id]) => fetchCourseById(id),
  )
  useEffect(() => {
    dispatch(createdNewQuiz(courseId))
  }, [])
  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: `${course ? course.title : ""}`,
      as: `/courses/${courseId}/listing`,
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
