import React, { useState } from "react"
import useBreadcrumbs from "../../../../hooks/useBreadcrumbs"
import { useRouter } from "next/router"
import { getAllAnswers, fetchQuiz } from "../../../../services/quizzes"
import { AnswerList } from "../../../../components/AnswerList"
import usePromise from "react-use-promise"
import { Answer } from "../../../../types/Answer"
import { TextField, MenuItem, Switch, Typography } from "@material-ui/core"
import styled from "styled-components"
import { Pagination, Skeleton } from "@material-ui/lab"
import Head from "next/head"
import TabNavigator from "../../../../components/TabNavigator"

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
const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

export const AllAnswers = () => {
  const route = useRouter()
  const quizId = route.query.quizId?.toString() ?? ""
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [expandAll, setExpandAll] = useState(false)
  let answers: { results: Answer[]; total: number } | undefined
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

  if (!answers) {
    return (
      <>
        <div>
          <Head>
            <title>loading... | Quizzes</title>
            <meta
              name="quizzes"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
        </div>
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
        <StyledSkeleton variant="rect" height={250} animation="wave" />
      </>
    )
  }

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
        <div>Error while fetching answers.</div>
      </>
    )
  }

  return (
    <>
      <div>
        <Head>
          <title>All answers | Quizzes</title>
          <meta
            name="quizzes"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>
      <TabNavigator quizId={quizId} value={3} />
      {answers.results.length === 0 ? (
        <>
          <Typography variant="h3">No Answers for this quiz</Typography>
        </>
      ) : (
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
            />
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
            data={answers.results}
            error={error}
            expandAll={expandAll}
          />
          <PaginationField>
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
            />
          </PaginationField>
        </>
      )}
    </>
  )
}

export default AllAnswers
