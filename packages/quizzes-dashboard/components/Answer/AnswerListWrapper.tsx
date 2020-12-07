import React, { useContext, useState } from "react"
import styled from "styled-components"
import { Pagination } from "@material-ui/lab"
import { AnswerList } from "./AnswerList"
import SkeletonLoader from "../Shared/SkeletonLoader"
import { Button, Switch, Typography } from "@material-ui/core"
import { SwitchField } from "../QuizPages/answers/styles"
import { editableAnswerStates } from "./constants"
import { Answer } from "../../types/Answer"

import { AnswerListContext } from "../../contexts/AnswerListContext"

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
  expandAll: boolean
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
  expandAll,
  page,
  handlePageChange,
  answersError,
  answers,
  fetchingAnswers,
}: WrapperProps) => {
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([])

  const { enableSearch } = useContext(AnswerListContext)
  console.log(
    "💩 ~ file: AnswerListWrapper.tsx ~ line 64 ~ enableSearch",
    enableSearch,
  )

  if (answersError) {
    return <>Something went wrong...</>
  }

  const resultsAvailable = answers?.results.length > 0

  const handleSelectAll = () => {
    const allSelected = answers?.results
      .filter(answer => editableAnswerStates.includes(answer.status))
      .map(editableAnswer => editableAnswer.id)

    setBulkSelectedIds(allSelected)
  }

  return (
    <>
      <BulkSelectWrapper>
        <SwitchField>
          <Typography>Bulk select answers</Typography>
          <Switch
            checked={bulkSelectMode}
            onChange={_ => {
              setBulkSelectMode(!bulkSelectMode)
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
              onClick={() => setBulkSelectedIds([])}
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
          <AnswerList
            data={answers.results}
            expandAll={expandAll}
            bulkSelectMode={bulkSelectMode}
            bulkSelectedIds={bulkSelectedIds}
          />
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
