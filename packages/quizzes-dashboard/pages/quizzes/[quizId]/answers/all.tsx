import React, { useState, useEffect } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { getAllAnswers, fetchQuiz } from "../../../../services/quizzes"
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

export const SwitchField = styled.div`
  display: flex;
  align-items: baseline;
`

export const Paginator = styled(Pagination)`
  display: flex !important;
`

export const AllAnswers = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [expandAll, setExpandAll] = useState(false)
  let answers: { quizAnswers: Answer[]; answersAmount: number } | undefined
  let error: any
  ;[answers, error] = usePromise(() => getAllAnswers(quizId, page, size), [
    page,
    size,
  ])
  const [quizResponse, quizError] = usePromise(() => fetchQuiz(quizId), [])

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
      label: "All Answers",
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
            count={Math.ceil(answers.answersAmount / size)}
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
      <SwitchField>
        <Typography>Expand all</Typography>
        <Switch
          checked={expandAll}
          onChange={event => {
            setExpandAll(event.target.checked)
          }}
        />
      </SwitchField>
      <AnswerList
        data={answers?.quizAnswers}
        error={error}
        expandAll={expandAll}
      />
      <PaginationField>
        {answers ? (
          <Paginator
            siblingCount={2}
            boundaryCount={2}
            count={Math.ceil(answers.answersAmount / size)}
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

export default AllAnswers
