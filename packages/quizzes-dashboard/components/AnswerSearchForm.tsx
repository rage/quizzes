import { Button, TextField, Typography } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"

interface IFormProps {
  handleSubmit: (searchQuery: string) => Promise<void>
  fetchingAnswers?: boolean
}

const FormWrapper = styled.form`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4rem 0;
`

const FormElementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const AnswerSearchForm = (props: IFormProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayingResultsFor, setDisplayingResultsFor] = useState<
    null | string
  >(null)

  const { handleSubmit } = props

  const handleClick = () => {
    handleSubmit("")
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
            helperText="Enter a keyphrase to search for"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={props.fetchingAnswers || false}
            style={{ marginLeft: 30 }}
          >
            Search
          </Button>
          <Button
            onClick={handleClick}
            variant="contained"
            disabled={props.fetchingAnswers || false}
            style={{ marginLeft: 30 }}
          >
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
