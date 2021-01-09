import { Button, TextField, Typography } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"

interface IFormProps {
  handleSubmit: (searchQuery: string) => Promise<void>
  searchResultCount?: number
  fetchingAnswers?: boolean
}

const FormWrapper = styled.form`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const ResultsInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 2rem;
`

const FormElementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  button {
    white-space: nowrap;
    margin-left: 1rem;
    padding: 0.5rem 2.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    button {
      margin: 1rem 0;
    }
  }
`

const AnswerSearchForm = (props: IFormProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayingResultsFor, setDisplayingResultsFor] = useState<
    null | string
  >(null)
  const { handleSubmit, searchResultCount } = props

  const handleSearchClearance = () => {
    handleSubmit("")
    setSearchQuery("")
    setDisplayingResultsFor(null)
  }

  return (
    <>
      <FormWrapper
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(searchQuery)
          setDisplayingResultsFor(searchQuery)
        }}
      >
        <FormElementContainer>
          <TextField
            label="Phrase"
            multiline
            rowsMax={8}
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            variant="outlined"
            helperText="Enter a search phrase"
            fullWidth={true}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={props.fetchingAnswers || false}
          >
            Search
          </Button>
          <Button onClick={handleSearchClearance} variant="contained">
            Clear Search
          </Button>
        </FormElementContainer>
      </FormWrapper>
      {displayingResultsFor && (
        <ResultsInfoContainer>
          <Typography variant="h2" style={{ margin: "3rem 0" }}>
            Displaying results for: "<em>{displayingResultsFor}</em>"
          </Typography>
          {searchResultCount ? (
            <Typography variant="h3">
              There were a total of <strong>{searchResultCount}</strong>{" "}
              matches.
            </Typography>
          ) : null}
        </ResultsInfoContainer>
      )}
    </>
  )
}

export default AnswerSearchForm
