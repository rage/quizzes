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
import { TextField, MenuItem, Switch, Typography } from "@material-ui/core"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"

export const SizeSelectorContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
  justify-content: flex-end;
`

export const SizeSelectorField = styled(TextField)`
  display: flex !important;
`

export const PaginationField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
`

export const Paginator = styled(Pagination)`
  display: flex !important;
`

export const RequiringAttention = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [expandAll, setExpandAll] = useState(false)
  let answers: { results: Answer[]; total: number } | undefined
  let error: any
  ;[answers, error] = usePromise(
    () => getAnswersRequiringAttention(quizId, page, size),
    [page, size],
  )

  const [quizResponse, quizError] = usePromise(() => fetchQuiz(quizId), [])

  console.log(answers)

  useBreadcrumbs([
    { label: "Courses", as: "/", href: "/" },
    {
      label: "Course",
      as: `/courses/${quizResponse?.courseId}`,
      href: "/courses/[courseId]",
    },
    {
      label: "Quiz Overview",
      as: `/quizzes/${quizId}/overview`,
      href: "/quizzes/[quizId]/overview",
    },
    {
      label: "Answers Requiring Attention",
    },
  ])

  return (
    <>
      <SizeSelectorContainer>
        <SizeSelectorField
          value={size}
          size="medium"
          label="Answers"
          variant="outlined"
          select
          onChange={event => setSize(Number(event.target.value))}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </SizeSelectorField>
      </SizeSelectorContainer>
      <PaginationField>
        {answers ? (
          <Paginator
            siblingCount={2}
            boundaryCount={2}
            count={Math.ceil(answers.total / size)}
            size="large"
            color="primary"
            showFirstButton
            showLastButton
            page={page}
            onChange={(event, nextPage) => setPage(nextPage)}
          ></Paginator>
        ) : (
          ""
        )}
      </PaginationField>
      <Switch
        checked={expandAll}
        onChange={event => setExpandAll(event.target.checked)}
      />
      <Typography>Expand all</Typography>
      <AnswerList data={answers?.results} error={error} expandAll={expandAll} />
      <PaginationField>
        {answers ? (
          <Paginator
            siblingCount={2}
            boundaryCount={2}
            count={Math.ceil(answers.total / size)}
            size="large"
            color="primary"
            showFirstButton
            showLastButton
            page={page}
            onChange={(event, nextPage) => setPage(nextPage)}
          ></Paginator>
        ) : (
          ""
        )}
      </PaginationField>
    </>
  )
}

export default RequiringAttention
