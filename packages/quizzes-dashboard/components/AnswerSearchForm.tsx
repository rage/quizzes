import { Button, TextField, Typography } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

interface IFormProps {
  handleSubmit: (searchQuery: string) => Promise<void>
  fetchingAnswers?: boolean
}

const FormWrapper = styled.form`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FormElementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin-left: 2rem;
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
  const { handleSubmit } = props

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
        <Typography variant="h2" style={{ margin: "3rem 0" }}>
          Displaying results for: "{displayingResultsFor}"
        </Typography>
      )}
    </>
  )
}

export default AnswerSearchForm
