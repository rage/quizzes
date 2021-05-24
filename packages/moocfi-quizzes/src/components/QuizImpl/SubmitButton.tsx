import * as React from "react"
import ThemeProviderContext from "../../contexes/themeProviderContext"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../state/store"
import * as quizAnswerActions from "../../state/quizAnswer/actions"
import { StyledButton } from "../styleComponents"

export interface SubmitButtonProps {
  disabled: boolean
  onClick: any
}

const SubmitButton: React.FunctionComponent = () => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const dispatch = useDispatch()
  const submitLocked = useTypedSelector(state => state.quizAnswer.submitLocked)
  const answerFormatIsValid = useTypedSelector(
    state => state.quizAnswer.answerFormatIsValid,
  )
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
      <ThemedSubmitButton
        disabled={submitLocked || !answerFormatIsValid}
        onClick={handleSubmit}
      >
        {buttonText}
      </ThemedSubmitButton>
    )
  }

  return (
    <StyledButton
      variant="contained"
      color="primary"
      disabled={submitLocked || pastDeadline || !answerFormatIsValid}
      onClick={handleSubmit}
      aria-label={buttonText}
    >
      {buttonText}
    </StyledButton>
  )
}

export default SubmitButton
