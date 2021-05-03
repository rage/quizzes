import { ActionType, getType } from "typesafe-actions"
import * as quizAnswer from "./actions"
import { QuizAnswer } from "../../modelTypes"

export const initialState: QuizAnswerState = {
  quizAnswer: {
    languageId: "",
    quizId: "",
    itemAnswers: [],
  },
  submitLocked: true,
  answerFormatIsValid: true,
  itemAnswersReady: {},
  attemptedDisabledSubmit: false,
  noChangesSinceSuccessfulSubmit: false,
  noChangesAfterLoading: true,
  quizDisabled: false,
  pastDeadline: false,
}

export type QuizAnswerState = {
  quizAnswer: QuizAnswer
  submitLocked: boolean
  answerFormatIsValid: boolean
  itemAnswersReady: Record<string, boolean>
  attemptedDisabledSubmit: boolean
  noChangesSinceSuccessfulSubmit: boolean
  noChangesAfterLoading: boolean
  quizDisabled: boolean
  pastDeadline: boolean
}

export const quizAnswerReducer = (
  state: QuizAnswerState = initialState,
  action: ActionType<typeof quizAnswer>,
): QuizAnswerState => {
  switch (action.type) {
    case getType(quizAnswer.setAnswerFormatIsValid):
      return {
        ...state,
        answerFormatIsValid: action.payload,
      }
    case getType(quizAnswer.setUnlocked):
      return {
        ...state,
        submitLocked: false,
      }
    case getType(quizAnswer.setQuizDisabled):
      return { ...state, quizDisabled: action.payload }
    case getType(quizAnswer.setAnswer):
      let newItemAnswersReady: Record<string, boolean> = {}
      let newQuizAnswer = action.payload
      newQuizAnswer.itemAnswers.forEach(ia => {
        newItemAnswersReady[ia.quizItemId] = ia.id !== undefined
      })

      return {
        ...state,
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: newQuizAnswer,
        attemptedDisabledSubmit: state.attemptedDisabledSubmit,
      }
    case getType(quizAnswer.clear):
      return initialState
    case getType(quizAnswer.setNoChangesSinceSuccessfulSubmit):
      return { ...state, noChangesSinceSuccessfulSubmit: true }
    case getType(quizAnswer.setLocked):
      return { ...state, submitLocked: true }
    case getType(quizAnswer.pastDeadline):
      return { ...state, pastDeadline: true }
    case getType(quizAnswer.setAttemptedSubmit):
      return { ...state, attemptedDisabledSubmit: true }
    case getType(quizAnswer.clearAttemptedSubmit):
      return { ...state, attemptedDisabledSubmit: false }
    case getType(quizAnswer.changeIntDataAction):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true
      return {
        ...state,
        submitLocked: !readyToSubmit(newItemAnswersReady),
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: {
          ...state.quizAnswer,
          itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
            ia.quizItemId === action.payload.itemId
              ? { ...ia, intData: action.payload.newValue }
              : ia,
          ),
        },
        noChangesSinceSuccessfulSubmit: false,
        noChangesAfterLoading: false,
      }
    case getType(quizAnswer.changeTextDataAction):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] =
        action.payload.readyToSubmit

      return {
        ...state,
        submitLocked: !readyToSubmit(newItemAnswersReady),
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: {
          ...state.quizAnswer,

          itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
            ia.quizItemId === action.payload.itemId
              ? { ...ia, textData: action.payload.newValue }
              : ia,
          ),
        },
        noChangesSinceSuccessfulSubmit: false,
        noChangesAfterLoading: false,
      }

    case getType(quizAnswer.changeCheckboxDataAction):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true

      return {
        ...state,
        submitLocked: !readyToSubmit(newItemAnswersReady),
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: {
          ...state.quizAnswer,
          itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
            ia.quizItemId === action.payload.itemId
              ? {
                  ...ia,
                  // 1 is selected and 0 is not selected. When intData is undefined toggle it to 1.
                  intData: ia.intData === 1 ? 0 : 1,
                }
              : ia,
          ),
        },
        noChangesSinceSuccessfulSubmit: false,
        noChangesAfterLoading: false,
      }
    case getType(quizAnswer.chooseOptionAction):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true

      const { itemId, optionId, multi } = action.payload

      const current = state.quizAnswer.itemAnswers.find(
        ia => ia.quizItemId === itemId,
      )
      if (current === undefined) {
        return state
      }
      const newItemAnswer = { ...current }

      const previouslyChosen = newItemAnswer.optionAnswers.some(
        oa => oa.quizOptionId === optionId,
      )
      if (previouslyChosen) {
        const remainingChosenOptions = current.optionAnswers.filter(
          oa => oa.quizOptionId !== optionId,
        ).length

        if (remainingChosenOptions <= 0) {
          newItemAnswersReady[`${action.payload.itemId}`] = false
        }

        return {
          ...state,
          submitLocked: !readyToSubmit(newItemAnswersReady),
          itemAnswersReady: newItemAnswersReady,
          quizAnswer: {
            ...state.quizAnswer,
            itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
              ia.quizItemId !== itemId
                ? ia
                : {
                    ...ia,
                    optionAnswers: ia.optionAnswers.filter(
                      oa => oa.quizOptionId !== optionId,
                    ),
                  },
            ),
          },
          noChangesSinceSuccessfulSubmit: false,
          noChangesAfterLoading: false,
        }
      }
      const newOptionAnswers = multi
        ? [...newItemAnswer.optionAnswers].concat({
            quizOptionId: optionId,
          })
        : [
            {
              quizOptionId: optionId,
            },
          ]

      return {
        ...state,
        submitLocked: !readyToSubmit(newItemAnswersReady),
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: {
          ...state.quizAnswer,
          itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
            ia.quizItemId !== itemId
              ? ia
              : { ...ia, optionAnswers: newOptionAnswers },
          ),
        },
        noChangesSinceSuccessfulSubmit: false,
        noChangesAfterLoading: false,
      }

    default:
      return state
  }
}

const readyToSubmit = (answerStatuses: Record<string, boolean>) => {
  for (let itemId in answerStatuses) {
    if (!answerStatuses[itemId]) {
      return false
    }
  }
  return true
}
