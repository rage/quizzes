import React, { useState, useEffect } from "react"
import usePromise from "react-use-promise"
import { getAnswersMatchingQuery } from "../../../services/quizzes"
import { AnswerList } from "../../AnswerList"
import styled from "styled-components"
import { Button, TextField, Typography } from "@material-ui/core"
import { Pagination, Skeleton } from "@material-ui/lab"
import { StyledSkeleton } from "./styles"

export const PaginationField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
`

export const Paginator = styled(Pagination)`
  display: flex !important;
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

export const Results = ({
  quizId,
  size,
  order,
  filterparameters,
  expandAll,
  page,
  handlePageChange,
}: WrapperProps) => {
  const [searchResults, setSearchResults] = useState<any>([])
  console.log("💩 ~ file: results.tsx ~ line 41 ~ searchResults", searchResults)
  const [searchQuery, setSearchQuery] = useState("")
  const [fetchingAnswers, setFetchingAnswers] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async () => {
    try {
      setFetchingAnswers(true)
      //TODO: handle empty query
      const response = await getAnswersMatchingQuery(
        quizId,
        page,
        size,
        order,
        filterparameters,
        searchQuery,
      )
      setSearchResults(response)
    } catch (err) {
      setError(true)
    } finally {
      setFetchingAnswers(false)
    }
  }

  if (fetchingAnswers)
    return <StyledSkeleton variant="rect" height={400} animation="wave" />

  if (error) {
    return <>Something went wrong...Error</>
  }

  return (
    <>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <TextField
          label="Query"
          multiline
          rowsMax={8}
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          variant="outlined"
          helperText="Enter a keyphrase to search for"
        />
        <Button type="submit" variant="contained" style={{ marginLeft: 30 }}>
          Search
        </Button>
      </form>
      {searchResults?.results?.length > 0 && (
        <>
          <PaginationField>
            <Paginator
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(searchResults.total / size)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              onChange={(event, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
          <AnswerList
            data={searchResults?.results}
            error={error}
            expandAll={expandAll}
          />
          <PaginationField>
            <Paginator
              siblingCount={2}
              boundaryCount={2}
              count={Math.ceil(searchResults?.total / size)}
              size="large"
              color="primary"
              showFirstButton
              showLastButton
              page={page}
              onChange={(event, nextPage) => handlePageChange(nextPage)}
            />
          </PaginationField>
        </>
      )}
    </>
  )
}

export default Results
