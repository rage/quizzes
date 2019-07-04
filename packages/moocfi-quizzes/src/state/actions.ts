import { ActionCreator } from "redux"
import { ThunkAction } from "./store"
import { getQuizInfo } from "../services/quizService"
import * as userActions from "./user/actions"
import * as languageActions from "./language/actions"
import * as quizActions from "./quiz/actions"
import * as quizAnswerActions from "./quizAnswer/actions"
import * as messageActions from "./message/actions"

export const initialize: ActionCreator<ThunkAction> = (
  id: string,
  languageId: string,
  accessToken: string,
) => async dispatch => {
  try {
    let { quiz, quizAnswer, userQuizState } = await getQuizInfo(
      id,
      languageId,
      accessToken,
    )

    if (!quizAnswer) {
      quizAnswer = {
        quizId: quiz.id,
        languageId,
        itemAnswers: quiz.items.map(item => {
          return {
            quizItemId: item.id,
            textData: "",
            intData: null,
            optionAnswers: [],
          }
        }),
      }
    }

    dispatch(userActions.setToken(accessToken))
    dispatch(languageActions.set(languageId))
    dispatch(quizActions.set(quiz))
    dispatch(quizAnswerActions.set(quizAnswer))
    dispatch(userActions.setQuizState(userQuizState))
  } catch (e) {
    dispatch(messageActions.set(e.toString()))
  }
}
