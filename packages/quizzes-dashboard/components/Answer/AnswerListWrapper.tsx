import React from "react"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"
import { AnswerList } from "./AnswerList"
import SkeletonLoader from "../Shared/SkeletonLoader"
import { Typography } from "@material-ui/core"

import { Answer } from "../../types/Answer"

export const PaginationField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
`

interface WrapperProps {
  quizId: string
  size: number
  order: string
  page: number
  answersError?: Error | undefined
  fetchingAnswers: Boolean
  answers: {
    results: Answer[]
    total: number
  }
  handlePageChange: (nextPage: number) => void
}

export const AnswerListWrapper = ({
  size,
  page,
  handlePageChange,
  answersError,
  answers,
  fetchingAnswers,
}: WrapperProps) => {
  if (answersError) {
    return <>Something went wrong...</>
  }

  const resultsAvailable = answers?.results.length > 0

  return (
    <>
      {resultsAvailable ? (
        <>
          <PaginationField>
            <Pagination
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(answers.total / size)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              onChange={(_, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
          <AnswerList data={answers.results} />
          <PaginationField>
            <Pagination
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(answers.total / size)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              onChange={(_, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
        </>
      ) : { fetchingAnswers } ? (
        <SkeletonLoader height={400} skeletonCount={10} />
      ) : (
        <>
          <Typography variant="h3">No answers found.</Typography>
        </>
      )}
    </>
  )
}

export default AnswerListWrapper
