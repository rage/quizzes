import { Button, TextField } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"

interface IFormProps {
  handleSubmit: (searchQuery: string) => Promise<void>
  fetchingAnswers?: boolean
}

const FormWrapper = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4rem 0;
`

const AnswerSearchForm = (props: IFormProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const { handleSubmit } = props

  return (
    <FormWrapper
      onSubmit={e => {
        e.preventDefault()
        handleSubmit(searchQuery)
      }}
    >
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
    </FormWrapper>
  )
}

export default AnswerSearchForm
