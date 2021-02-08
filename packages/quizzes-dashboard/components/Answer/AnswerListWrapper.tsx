import React from "react"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"
import { AnswerList } from "./AnswerList"
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
  answers,
}: WrapperProps) => {
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
  )
}

export default AnswerListWrapper
