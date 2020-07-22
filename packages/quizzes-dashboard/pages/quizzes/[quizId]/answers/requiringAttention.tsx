import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  getAnswersRequiringAttention,
  fetchQuiz,
} from "../../../../services/quizzes"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { AnswerList } from "../../../../components/AnswerList"
import usePromise from "react-use-promise"
import { Answer } from "../../../../types/Answer"
import { TextField, MenuItem } from "@material-ui/core"

export const RequiringAttention = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  let answers: Answer[] | undefined
  let error: any
  ;[answers, error] = usePromise(
    () => getAnswersRequiringAttention(quizId, page, size),
    [page, size],
  )

  const [quizResponse, quizError] = usePromise(() => fetchQuiz(quizId), [])

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quizResponse?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz",
      as: `/quizzes/${quizId}/edit`,
      href: "/quizzes/[quizId]/edit",
    },
    {
      label: "Answers Requiring Attention",
    },
  ])

  return (
    <>
      <TextField
        label="answers per page"
        variant="outlined"
        type="select"
        onChange={event => setSize(Number(event.target.value))}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </TextField>
      <AnswerList data={answers} error={error} />
    </>
  )
}

export default RequiringAttention
