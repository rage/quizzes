import React from "react"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"
import { AnswerList } from "./AnswerList"
import SkeletonLoader from "../Shared/SkeletonLoader"
import { Button, Switch, Typography } from "@material-ui/core"
import { SwitchField } from "../quizPages/answers/styles"
import { editableAnswerStates } from "./constants"
import { Answer } from "../../types/Answer"

import {
  setBulkSelectedIds,
  toggleBulkSelectMode,
  useAnswerListState,
} from "../../contexts/AnswerListContext"

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

const BulkSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  div:nth-of-type(1) {
    margin-right: 3rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    > button {
      margin: 1rem 0;
    }
  }
`

export const AnswerListWrapper = ({
  size,
  page,
  handlePageChange,
  answersError,
  answers,
  fetchingAnswers,
}: WrapperProps) => {
  const [{ bulkSelectMode }, dispatch] = useAnswerListState()

  if (answersError) {
    return <>Something went wrong...</>
  }

  const resultsAvailable = answers?.results.length > 0

  const handleSelectAll = () => {
    const allSelected = answers?.results
      .filter(answer => editableAnswerStates.includes(answer.status))
      .map(editableAnswer => editableAnswer.id)
    dispatch(setBulkSelectedIds(allSelected))
  }

  return (
    <>
      <BulkSelectWrapper>
        <SwitchField>
          <Typography>Bulk select answers</Typography>
          <Switch
            checked={bulkSelectMode}
            onChange={_ => {
              dispatch(toggleBulkSelectMode())
            }}
          />
        </SwitchField>
        {bulkSelectMode && (
          <>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ minWidth: "7rem" }}
              onClick={handleSelectAll}
            >
              Select all
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "2rem" }}
              onClick={() => {
                dispatch(setBulkSelectedIds([]))
              }}
            >
              Clear Selection
            </Button>
          </>
        )}
      </BulkSelectWrapper>
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
