import React from "react"
import QuizEditForms from "../../../../components/QuizEditForms"
import { Typography } from "@material-ui/core"
import SaveButton from "../../../../components/SaveButton"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { withRouter } from "next/router"

const NewQuiz = ({ router }: any) => {
  const courseId = router.query.courseId
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
      <SaveButton />
      <Typography variant="h1">Editing new quiz</Typography>
      <QuizEditForms />
    </>
  )
}

export default withRouter(NewQuiz)
