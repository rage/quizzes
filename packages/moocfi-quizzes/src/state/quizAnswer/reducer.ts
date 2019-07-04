import { ActionType, getType } from "typesafe-actions"
import * as quizAnswer from "./actions"
import { QuizAnswer } from "../../modelTypes"

const initialValue = {
  quizAnswer: null,
  submitLocked: true,
  itemAnswersReady: null,
}

export type QuizAnswerState = {
  quizAnswer: QuizAnswer
  submitLocked: boolean
  itemAnswersReady: Record<string, boolean>
}

export const quizAnswerReducer = (
  state: QuizAnswerState = initialValue,
  action: ActionType<typeof quizAnswer>,
): QuizAnswerState => {
  switch (action.type) {
    case getType(quizAnswer.set):
      let newItemAnswersReady: Record<string, boolean> = {}
      let newQuizAnswer = action.payload
      newQuizAnswer.itemAnswers.forEach(ia => {
        newItemAnswersReady[ia.quizItemId] = false
      })

      return {
        submitLocked: true,
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: newQuizAnswer,
      }
    case getType(quizAnswer.clear):
      return initialValue
    case getType(quizAnswer.setLocked):
      return { ...state, submitLocked: true }

    case getType(quizAnswer.changeIntData):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true
      return {
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
      }
    case getType(quizAnswer.changeTextDataAction):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] =
        action.payload.readyToSubmit

      return {
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
      }

    case getType(quizAnswer.changeCheckboxData):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true

      return {
        submitLocked: !readyToSubmit(newItemAnswersReady),
        itemAnswersReady: newItemAnswersReady,
        quizAnswer: {
          ...state.quizAnswer,
          itemAnswers: state.quizAnswer.itemAnswers.map(ia =>
            ia.quizItemId === action.payload.itemId
              ? {
                  ...ia,
                  optionAnswers: ia.optionAnswers.some(
                    oa => oa.quizOptionId === action.payload.optionId,
                  )
                    ? ia.optionAnswers.filter(
                        oa => oa.quizOptionId !== action.payload.optionId,
                      )
                    : ia.optionAnswers.concat({
                        quizOptionId: action.payload.optionId,
                        quizItemAnswerId:
                          state.quizAnswer.itemAnswers[0].quizAnswerId,
                      }),
                }
              : ia,
          ),
        },
      }
    case getType(quizAnswer.chooseOption):
      newItemAnswersReady = { ...state.itemAnswersReady }
      newItemAnswersReady[`${action.payload.itemId}`] = true

      const { itemId, optionId, multi } = action.payload
      const newItemAnswer = {
        ...state.quizAnswer.itemAnswers.find(ia => ia.quizItemId === itemId),
      }
      const previouslyChosen = newItemAnswer.optionAnswers.some(
        oa => oa.quizOptionId === optionId,
      )
      if (previouslyChosen) {
        return {
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
        }
      }
      const newOptionAnswers = multi
        ? [...newItemAnswer.optionAnswers].concat({
            quizItemAnswerId: state.quizAnswer.itemAnswers[0].quizAnswerId,
            quizOptionId: optionId,
          })
        : [
            {
              quizItemAnswerId: state.quizAnswer.itemAnswers[0].quizAnswerId,
              quizOptionId: optionId,
            },
          ]
      return {
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
