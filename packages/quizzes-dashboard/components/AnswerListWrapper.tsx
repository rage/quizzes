import React, { useState, useEffect } from "react"
import usePromise from "react-use-promise"
import { getAllAnswers } from "../services/quizzes"
import { AnswerList } from "./AnswerList"
import styled from "styled-components"
import { Pagination, Skeleton } from "@material-ui/lab"

export const PaginationField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
`

export const Paginator = styled(Pagination)`
  display: flex !important;
`

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

interface WrapperProps {
  quizId: string
  size: number
  order: string
  filterparameters: string[]
  expandAll: boolean
  page: number
  handlePageChange: (nextPage: number) => void
}

export const AnswerListWrapper = ({
  quizId,
  size,
  order,
  filterparameters,
  expandAll,
  page,
  handlePageChange,
}: WrapperProps) => {
  const [answers, answersError] = usePromise(
    () => getAllAnswers(quizId, page, size, order, filterparameters),
    [quizId, page, size, order, filterparameters],
  )

  if (!answers) {
    return (
      <>
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
        <StyledSkeleton variant="rect" height={400} animation="wave" />
      </>
    )
  }

  if (answersError) {
    return <>Something went wrong...</>
  }

  return (
    <>
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
          onChange={(event, nextPage) => handlePageChange(nextPage)}
        />
      </PaginationField>
      <AnswerList
        data={answers.results}
        error={answersError}
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
          onChange={(event, nextPage) => handlePageChange(nextPage)}
        />
      </PaginationField>
    </>
  )
}

export default AnswerListWrapper
