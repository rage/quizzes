import * as React from "react"
import Quiz from "../../src"
import { Typography } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import styled from "styled-components"
import SimpleErrorBoundary from "./SimpleErrorBoundary"
import { useInputWithLocalStorage } from "./customHooks"

const FieldWrapper = styled.div`
  padding: 1rem;
`

const App = () => {
  const id = useInputWithLocalStorage("id", "")
  const languageId = useInputWithLocalStorage("languageId", "fi_FI")
  const accessToken = useInputWithLocalStorage("savedAccessToken", "")
  const baseUrl = useInputWithLocalStorage(
    "savedBaseUrl",
    "https://quizzes.mooc.fi",
  )

  return (
    <>
      <Typography variant="h4" component="h1">
        Quizzes testing
      </Typography>
      <FieldWrapper>
        <TextField variant="outlined" {...id} label="Quiz id" fullWidth />
      </FieldWrapper>
      <FieldWrapper>
        <TextField
          variant="outlined"
          {...languageId}
          label="Language id"
          fullWidth
        />
      </FieldWrapper>
      <FieldWrapper>
        <TextField
          variant="outlined"
          {...accessToken}
          label="Access token"
          fullWidth
        />
      </FieldWrapper>
      <FieldWrapper>
        <TextField variant="outlined" {...baseUrl} label="Base url" fullWidth />
      </FieldWrapper>
      <div>
        <Typography variant="h5" component="h1">
          Quiz
        </Typography>
        <SimpleErrorBoundary>
          <Quiz
            id={id.value}
            languageId={languageId.value}
            accessToken={accessToken.value}
            backendAddress={baseUrl.value}
          />
        </SimpleErrorBoundary>
      </div>
    </>
  )
}

export default App
