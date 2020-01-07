import * as React from "react"
import styled from "styled-components"
import ThemeProviderContext from "../../contexes/themeProviderContext"
import { Button } from "@material-ui/core"
import { useDispatch } from "react-redux"

import { useTypedSelector } from "../../state/store"
import * as quizAnswerActions from "../../state/quizAnswer/actions"

const StyledSubmitButton = styled(Button)`
  padding: 10px 20px;
  border-radius: 15px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`

export interface SubmitButtonProps {
  disabled: boolean
  onClick: any
}

const SubmitButton: React.FunctionComponent = () => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const dispatch = useDispatch()
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const pastDeadline = useTypedSelector(state => state.quizAnswer.pastDeadline)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const noChangesAfterSuccessfulAnswer = useTypedSelector(
    state => state.quizAnswer.noChangesSinceSuccessfulSubmit,
  )
  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const noChangesAfterLoading = useTypedSelector(
    state => state.quizAnswer.noChangesAfterLoading,
  )

  if (!languageInfo) {
    return <div>language not set</div>
  }
  const generalLabels = languageInfo.general

  let buttonText = generalLabels.submitButtonLabel

  if (noChangesAfterLoading && userQuizState && userQuizState.tries > 0) {
    buttonText = generalLabels.submitButtonAlreadyAnsweredLabel
  }

  if (noChangesAfterSuccessfulAnswer) {
    buttonText = generalLabels.submitGeneralFeedbackLabel
  }

  const handleSubmit = () => {
    dispatch(quizAnswerActions.submit())
  }

  const ThemedSubmitButton = themeProvider.submitButton

  if (ThemedSubmitButton) {
    return (
      <ThemedSubmitButton disabled={submitLocked} onClick={handleSubmit}>
        {buttonText}
      </ThemedSubmitButton>
    )
  }

  return (
    <StyledSubmitButton
      variant="contained"
      color="primary"
      disabled={submitLocked || pastDeadline}
      onClick={handleSubmit}
    >
      {buttonText}
    </StyledSubmitButton>
  )
}

export default SubmitButton
