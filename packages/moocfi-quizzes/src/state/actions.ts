import { ActionCreator } from "redux"
import { ThunkAction, Dispatch } from "./store"
import { getQuizInfo } from "../services/quizService"
import * as userActions from "./user/actions"
import * as backendAddressActions from "./backendAddress/actions"
import * as languageActions from "./language/actions"
import * as quizActions from "./quiz/actions"
import * as quizAnswerActions from "./quizAnswer/actions"
import * as messageActions from "./message/actions"

export const initialize: ActionCreator<ThunkAction> = (
  id: string,
  languageId: string,
  accessToken: string,
  backendAddress?: string,
) => async (dispatch: Dispatch) => {
  try {
    let { quiz, quizAnswer, userQuizState } = await getQuizInfo(
      id,
      languageId,
      accessToken,
      backendAddress,
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

    if (backendAddress) {
      dispatch(backendAddressActions.set(backendAddress))
    }

    dispatch(userActions.setToken(accessToken))
    dispatch(languageActions.set(languageId))
    dispatch(quizActions.set(quiz))
    dispatch(quizAnswerActions.set(quizAnswer))
    if (userQuizState.status === "open") {
      dispatch(quizAnswerActions.setUnlocked())
    }
    dispatch(userActions.setQuizState(userQuizState))
  } catch (e) {
    dispatch(messageActions.set(e.toString()))
  }
}
