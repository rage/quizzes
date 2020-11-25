import React from "react"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"
import { AnswerList } from "./AnswerList"
import SkeletonLoader from "../Shared/SkeletonLoader"

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
  filterparameters: string[]
  expandAll: boolean
  page: number
  answersError: Error | undefined
  answers: any
  handlePageChange: (nextPage: number) => void
}

export const AnswerListWrapper = ({
  size,
  expandAll,
  page,
  handlePageChange,
  answersError,
  answers,
}: WrapperProps) => {
  if (!answers) return <SkeletonLoader height={400} skeletonCount={10} />

  if (answersError) {
    return <>Something went wrong...</>
  }

  return (
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
      <AnswerList data={answers.results} expandAll={expandAll} />
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
  )
}

export default AnswerListWrapper
