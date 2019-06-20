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
          <Thing
            baseUrl={baseUrl.value}
            id={id.value}
            languageId={languageId.value}
            accessToken={accessToken.value}
          />
        </SimpleErrorBoundary>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

function useInputWithLocalStorage(key, initialValue) {
  const [value, setValue] = useLocalStorage(key, initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  return { value, onChange }
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return window.localStorage.getItem(key) || initialValue
  })

  const setValue = value => {
    setStoredValue(value)
    window.localStorage.setItem(key, value)
  }

  return [storedValue, setValue]
}
