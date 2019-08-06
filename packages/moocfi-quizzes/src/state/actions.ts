import { ActionCreator } from "redux"
import { createAction } from "typesafe-actions"
import { ThunkAction, Dispatch } from "./store"
import { getQuizInfo } from "../services/quizService"
import * as userActions from "./user/actions"
import * as backendAddressActions from "./backendAddress/actions"
import * as feedbackDisplayedActions from "./feedbackDisplayed/actions"
import * as languageActions from "./language/actions"
import * as quizActions from "./quiz/actions"
import * as quizAnswerActions from "./quizAnswer/actions"
import * as messageActions from "./message/actions"
import { Quiz } from "../modelTypes"
import { QuizResponse } from "../services/quizService"

export const clearActionCreator = createAction("CLEAR")

export const initialize: ActionCreator<ThunkAction> = (
  id: string,
  languageId: string,
  accessToken: string,
  backendAddress?: string,
  fullInfoWithoutLogin?: boolean,
) => async (dispatch: Dispatch) => {
  dispatch(clearActionCreator())

  dispatch(languageActions.set(languageId))
  if (backendAddress) {
    dispatch(backendAddressActions.set(backendAddress))
  }

  try {
    const fullInfo = !!(accessToken || fullInfoWithoutLogin)

    const responseData = await getQuizInfo(
      id,
      accessToken,
      backendAddress,
      fullInfo,
    )

    let quiz, quizAnswer, userQuizState

    if ((responseData as Quiz).id) {
      quiz = responseData as Quiz
    } else {
      const loginResponse = responseData as QuizResponse
      quiz = loginResponse.quiz
      quizAnswer = loginResponse.quizAnswer
      userQuizState = loginResponse.userQuizState
    }

    if (!accessToken) {
      dispatch(quizAnswerActions.setQuizDisabled(true))
    }

    dispatch(quizActions.set(quiz))

    // having accessToken != being a logged in tmc user,
    // but posting answer still met with a server-side authentication so
    // does not matter
    if (!accessToken) {
      return
    }

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
    dispatch(quizAnswerActions.set(quizAnswer))

    if (
      userQuizState &&
      (userQuizState.status !== "open" ||
        (userQuizState.pointsAwarded &&
          Math.abs(userQuizState.pointsAwarded - quiz.points) < 0.001))
    ) {
      dispatch(feedbackDisplayedActions.display())
    }
    if (userQuizState) {
      dispatch(userActions.setQuizState(userQuizState))
    }
  } catch (e) {
    dispatch(messageActions.set(e.toString()))
  }
}
