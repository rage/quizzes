import { ActionType, getType } from "typesafe-actions"
import * as quizAnswer from "./actions"

const initialValue = null

export type QuizOptionAnswer = {
  id?: string
  quizItemAnswerId: string
  quizOptionId: string
}

export type QuizOptionAnswerState = Readonly<QuizOptionAnswer>

export type QuizItemAnswer = {
  id?: string
  quizAnswerId: string
  quizItemId: string
  textData: string
  intData: number
  correct: boolean
  optionAnswers: QuizOptionAnswerState[]
}
export type QuizItemAnswerState = Readonly<QuizItemAnswer>

export type QuizAnswer = {
  id?: string
  quizId: string
  userId: 96010
  languageId: string
  status:
    | "draft"
    | "submitted"
    | "spam"
    | "confirmed"
    | "rejected"
    | "deprecated"
  itemAnswers: QuizItemAnswerState[]
}
export type QuizAnswerState = Readonly<QuizAnswer>

export const quizAnswerReducer = (
  state: QuizAnswerState = initialValue,
  action: ActionType<typeof quizAnswer>,
): QuizAnswerState => {
  switch (action.type) {
    case getType(quizAnswer.set):
      return action.payload
    case getType(quizAnswer.clear):
      return initialValue

    case getType(quizAnswer.changeIntData):
      return {
        ...state,
        itemAnswers: state.itemAnswers.map(ia =>
          ia.quizItemId === action.payload.itemId
            ? { ...ia, intData: action.payload.newValue }
            : ia,
        ),
      }
    case getType(quizAnswer.changeTextData):
      return {
        ...state,
        itemAnswers: state.itemAnswers.map(ia =>
          ia.quizItemId === action.payload.itemId
            ? { ...ia, textData: action.payload.newValue }
            : ia,
        ),
      }

    case getType(quizAnswer.changeCheckboxData):
      return {
        ...state,
        itemAnswers: state.itemAnswers.map(ia =>
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
                      quizItemAnswerId: state.itemAnswers[0].quizAnswerId,
                    }),
              }
            : ia,
        ),
      }
    case getType(quizAnswer.chooseOption):
      const { itemId, optionId, multi } = action.payload
      const newItemAnswer = {
        ...state.itemAnswers.find(ia => ia.quizItemId === itemId),
      }
      const previouslyChosen = newItemAnswer.optionAnswers.some(
        oa => oa.quizOptionId === optionId,
      )
      if (previouslyChosen) {
        return {
          ...state,
          itemAnswers: state.itemAnswers.map(ia =>
            ia.quizItemId !== itemId
              ? ia
              : {
                  ...ia,
                  optionAnswers: ia.optionAnswers.filter(
                    oa => oa.quizOptionId !== optionId,
                  ),
                },
          ),
        }
      }
      const newOptionAnswers = multi
        ? [...newItemAnswer.optionAnswers].concat({
            quizItemAnswerId: state.itemAnswers[0].quizAnswerId,
            quizOptionId: optionId,
          })
        : [
            {
              quizItemAnswerId: state.itemAnswers[0].quizAnswerId,
              quizOptionId: optionId,
            },
          ]
      return {
        ...state,
        itemAnswers: state.itemAnswers.map(ia =>
          ia.quizItemId !== itemId
            ? ia
            : { ...ia, optionAnswers: newOptionAnswers },
        ),
      }

    default:
      return state
  }
}
