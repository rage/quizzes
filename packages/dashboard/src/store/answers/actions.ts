import { createAction } from "typesafe-actions"
import {
  getAttentionRequiringQuizAnswers,
  getQuizAnswers,
} from "../../services/quizAnswers"

export const set = createAction("answers/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answers/CLEAR")

export const setAllAnswers = quizId => {
  return async (dispatch, getState) => {
    try {
      const data = await getQuizAnswers(quizId, getState().user)
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setAttentionRequiringAnswers = quizId => {
  return async (dispatch, getState) => {
    try {
      const data = await getAttentionRequiringQuizAnswers(
        quizId,
        getState().user,
      )

      if (data.length === 0) {
        dispatch(set([]))
        return
      }

      const quiz = getState().quizzes.find(q => q.id === quizId)
      const peerReviewQuestions = quiz.peerReviewCollections
        .map(prc => prc.questions)
        .flat()

      const newData = data.map(answer => {
        return {
          ...answer,
          peerReviews: answer.peerReviews.map(pr => {
            return {
              ...pr,
              answers: pr.answers.sort((a1, a2) => {
                return (
                  peerReviewQuestions.find(
                    q => q.id === a1.peerReviewQuestionId,
                  ).order -
                  peerReviewQuestions.find(
                    q => q.id === a2.peerReviewQuestionId,
                  ).order
                )
              }),
            }
          }),
        }
      })

      dispatch(set(newData))
    } catch (error) {
      console.log(error)
    }
  }
}
