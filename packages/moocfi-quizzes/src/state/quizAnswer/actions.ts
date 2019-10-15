import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction } from "../store"
import { postAnswer } from "../../services/answerService"
import * as feedbackDisplayedActions from "../feedbackDisplayed/actions"
import * as userActions from "../user/actions"
import * as quizActions from "../quiz/actions"
import * as messageActions from "../message/actions"
import { QuizAnswer, QuizItem } from "../../modelTypes"
import { wordCount } from "../../utils/string_tools"

export const set = createAction("quizAnswer/SET", resolve => {
  return (quizAnswer: QuizAnswer) => resolve(quizAnswer)
})

export const setQuizDisabled = createAction(
  "quizAnswer/SET_QUIZ_DISABLED",
  resolve => (newValue: boolean) => resolve(newValue),
)

export const clear = createAction("quizAnswer/CLEAR")

export const setNoChangesSinceSuccessfulSubmit = createAction(
  "quizAnswer/SET_NO_CHANGES_SINCE_SUCCESSFUL_SUBMIT",
)

export const setLocked = createAction("quizAnswer/SET_LOCKED")

export const setUnlocked = createAction("quizAnswer/SET_UNLOCKED")

export const setAttemptedSubmit = createAction(
  "quizAnswer/ATTEMPT_DISABLED_SUBMIT",
  resolve => {
    return () => resolve()
  },
)

export const clearAttemptedSubmit = createAction(
  "quizAnswer/CLEAR_DISABLED_SUBMIT",
)

export const changeTextDataAction = createAction(
  "quizAnswer/UPDATE_TEXT_VALUE",
  resolve => (itemId: string, newValue: string, readyToSubmit: boolean) =>
    resolve({ itemId, newValue, readyToSubmit }),
)

export const changeIntDataAction = createAction(
  "quizAnswer/UPDATE_INT_VALUE",
  resolve => (itemId: string, newValue: number) =>
    resolve({ itemId, newValue }),
)

export const changeCheckboxDataAction = createAction(
  "quizAnswer/TOGGLE_CHECKBOX_VALUE",
  resolve => (itemId: string, optionId: string) =>
    resolve({ itemId, optionId }),
)

export const chooseOptionAction = createAction(
  "quizAnswer/CHOOSE_OPTION",
  resolve => (itemId: string, optionId: string, multi: boolean) =>
    resolve({ itemId, optionId, multi }),
)

export const chooseOption: ActionCreator<ThunkAction> = (
  itemId: string,
  optionId: string,
  multi: boolean,
) => (dispatch, getState) => {
  dispatch(messageActions.answerWasChanged())
  dispatch(chooseOptionAction(itemId, optionId, multi))
}

export const changeChosenOption: ActionCreator<ThunkAction> = (
  itemId: string,
  optionId: string,
) => (dispatch, getState) => {
  const item = getState().quiz.items.find(i => i.id === itemId)
  if (!item) {
    return
  }
  const multi = item.multi
  dispatch(messageActions.answerWasChanged())
  dispatch(feedbackDisplayedActions.hide())
  dispatch(chooseOption(itemId, optionId, multi))
}

export const changeCheckboxData: ActionCreator<ThunkAction> = (
  itemId: string,
  optionId: string,
) => (dispatch, getState) => {
  dispatch(messageActions.answerWasChanged())
  dispatch(changeCheckboxDataAction(itemId, optionId))
}

export const noticeDisabledSubmitAttempt: ActionCreator<ThunkAction> = () => (
  dispatch,
  getState,
) => {
  dispatch(setAttemptedSubmit())
  setTimeout(() => dispatch(clearAttemptedSubmit()), 5000)
}

export const changeIntData: ActionCreator<ThunkAction> = (
  itemId: string,
  newValue: number,
) => (dispatch, getState) => {
  dispatch(messageActions.answerWasChanged())
  dispatch(changeIntDataAction(itemId, newValue))
}

export const changeTextData: ActionCreator<ThunkAction> = (
  itemId: string,
  newValue: string,
) => (dispatch, getState) => {
  const item = getState().quiz.items.find(i => i.id === itemId)
  if (item === undefined) {
    return
  }
  dispatch(messageActions.answerWasChanged())
  dispatch(feedbackDisplayedActions.hide())
  const readyToSubmit = itemAnswerReadyForSubmit(newValue, item)
  dispatch(changeTextDataAction(itemId, newValue, readyToSubmit))
}

export const submit: ActionCreator<ThunkAction> = () => async (
  dispatch,
  getState,
) => {
  dispatch(setLocked())

  let { quiz, quizAnswer, userQuizState } = await postAnswer(
    getState().quizAnswer.quizAnswer,
    getState().user.accessToken,
    getState().backendAddress,
  )

  // wrong answer -> quiz not returned
  if (!quiz) {
    quiz = getState().quiz
  }

  dispatch(userActions.setQuizState(userQuizState))
  dispatch(setNoChangesSinceSuccessfulSubmit())

  if (userQuizState.status === "locked") {
    dispatch(quizActions.set(quiz))
    dispatch(set(quizAnswer))
    dispatch(feedbackDisplayedActions.display())
  } else if (
    userQuizState.pointsAwarded &&
    Math.abs(userQuizState.pointsAwarded - quiz.points) < 0.001
  ) {
    dispatch(quizActions.set(quiz))
    dispatch(set(quizAnswer))
    dispatch(feedbackDisplayedActions.display())
  } else {
    const languageInfo = getState().language.languageLabels
    if (languageInfo) {
      dispatch(
        messageActions.displayNotification(
          languageInfo.general.incorrectSubmitWhileTriesLeftLabel,
          "red",
          60 * 60 * 24,
          true,
        ),
      )
    }
  }
}

const itemAnswerReadyForSubmit = (textData: string, item: QuizItem) => {
  if (!item) {
    return false
  }
  if (!textData) return false
  const words = wordCount(textData)
  if (item.minWords && words < item.minWords) return false

  if (item.maxWords && words > item.maxWords) return false

  return true
}
