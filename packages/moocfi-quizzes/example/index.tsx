import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import Thing from "../src"
import { Typography } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import styled from "styled-components"
import SimpleErrorBoundary from "./SimpleErrorBoundary"
import { useState } from "react"

const FieldWrapper = styled.div`
  padding: 1rem;
`

const App = () => {
  const [id, setId] = useLocalStorage("savedQuizId", "")
  const [baseUrl, setBaseUrl] = useLocalStorage(
    "savedBaseUrl",
    "https://quizzes.mooc.fi",
  )
  const [languageId, setLanguageId] = useLocalStorage(
    "savedLanguageId",
    "fi_FI",
  )
  const [accessToken, setAccessToken] = useLocalStorage("savedAccessToken", "")
  return (
    <div>
      <Typography variant="h4" component="h1">
        Quizzes testing
      </Typography>
      <FieldWrapper>
        <TextField
          variant="outlined"
          onChange={e => {
            setId(e.target.value)
          }}
          value={id}
          label="Quiz id"
          fullWidth
        />
      </FieldWrapper>
      <FieldWrapper>
        <TextField
          variant="outlined"
          onChange={e => {
            setLanguageId(e.target.value)
          }}
          value={languageId}
          label="Language id"
          fullWidth
        />
      </FieldWrapper>
      <FieldWrapper>
        <TextField
          variant="outlined"
          onChange={e => {
            setAccessToken(e.target.value)
          }}
          value={accessToken}
          label="Access token"
          fullWidth
        />
      </FieldWrapper>
      <FieldWrapper>
        <TextField
          variant="outlined"
          onChange={e => {
            setBaseUrl(e.target.value)
          }}
          value={baseUrl}
          label="Base url"
          fullWidth
        />
      </FieldWrapper>
      <div>
        <Typography variant="h5" component="h1">
          Quiz
        </Typography>
        <SimpleErrorBoundary>
          <Thing
            baseUrl={baseUrl}
            id={id}
            languageId={languageId}
            accessToken={accessToken}
          />
        </SimpleErrorBoundary>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return window.localStorage.getItem(key) || initialValue
  })

  const setValue = value => {
    window.localStorage.setItem(key, value)
  }

  return [storedValue, setValue]
}
