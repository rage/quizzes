import * as React from "react"
import Quiz from "../../src"
import {
  FormControlLabel,
  Checkbox,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core"
import { StylesProvider } from "@material-ui/styles"
import styled from "styled-components"
import SimpleErrorBoundary from "./SimpleErrorBoundary"
import { useInput, useLocalStorage } from "./customHooks"

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const StyledQuizContainer = styled(props => <Paper {...props} />)`
  overflow: hidden;
  margin: 2rem 0;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 40px -12px;
  border-radius: 1rem;
  flex-basis: 800px;
`

const StyledTextField = styled(props => (
  <TextField variant="outlined" fullWidth {...props} />
))`
  margin: 1rem;
`

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0.5rem 1rem;
  width: 100%;
`

const App = () => {
  const id = useInput("id", "")
  const languageId = useInput("languageId", "fi_FI")
  const accessToken = useInput("savedAccessToken", "")
  const baseUrl = useInput("savedBaseUrl", "https://quizzes.mooc.fi")

  const [containerUsed, setContainerUsed] = useLocalStorage(
    "containerUsed",
    "true",
  )

  const [
    showFullInfoWhenLoggedOut,
    setShowFullInfoWhenLoggedOut,
  ] = useLocalStorage("showFullInfoWhenLoggedOut", "true")

  const toggleContainerUse = () =>
    setContainerUsed(containerUsed === "true" ? "false" : "true")

  const toggleShowFullInfo = () => {
    setShowFullInfoWhenLoggedOut(
      showFullInfoWhenLoggedOut === "true" ? "false" : "true",
    )
  }

  const quizPortion = (
    <Quiz
      id={id.value}
      languageId={languageId.value}
      accessToken={accessToken.value}
      backendAddress={baseUrl.value}
      fullInfoWithoutLogin={showFullInfoWhenLoggedOut === "true"}
    />
  )

  return (
    <>
      <Typography variant="h4" component="h1">
        Quizzes testing
      </Typography>

      <StyledTextField {...id} label="Quiz id" />
      <StyledTextField {...languageId} label="Language id" />
      <StyledTextField {...accessToken} label="Access token" />
      <StyledTextField {...baseUrl} label="Base url" />

      <StyledFormControlLabel
        label="Use a paper container"
        control={
          <Checkbox
            checked={containerUsed === "true"}
            onChange={toggleContainerUse}
            value={containerUsed.value}
            color="primary"
          />
        }
      />

      <StyledFormControlLabel
        label="Show full quiz info when logged out"
        control={
          <Checkbox
            checked={showFullInfoWhenLoggedOut === "true"}
            onChange={toggleShowFullInfo}
            value={showFullInfoWhenLoggedOut.value}
            color="primary"
          />
        }
      />

      <div>
        <Typography variant="h5" component="h1">
          Quiz
        </Typography>
        <SimpleErrorBoundary>
          {containerUsed === "true" ? (
            <FlexContainer>
              <StyledQuizContainer>{quizPortion}</StyledQuizContainer>
            </FlexContainer>
          ) : (
            quizPortion
          )}
        </SimpleErrorBoundary>
      </div>
    </>
  )
}

const StyledApp = () => (
  <StylesProvider injectFirst>
    <App />
  </StylesProvider>
)

export default StyledApp
