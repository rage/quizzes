import { createAction } from "typesafe-actions"
import { getPeerReviews } from "../../services/peerReviews"

export const set = createAction("peerReviews/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("peerReviews/CLEAR")

export const setPeerReviews = (answerId: string) => {
  return async (dispatch, getState) => {
    try {
      const data = await getPeerReviews(answerId, getState().user)

      const answer = getState().answers.find(a => a.id === answerId)
      const quiz = getState().quizzes.find(q => q.id === answer.quizId)
      const peerReviewQuestions = quiz.peerReviewCollections
        .map(prc => prc.questions)
        .flat()

      const newData = data.map(pr => {
        return {
          ...pr,
          answers: pr.answers.sort((a1, a2) => {
            return (
              peerReviewQuestions.find(q => q.id === a1.peerReviewQuestionId)
                .order -
              peerReviewQuestions.find(q => q.id === a2.peerReviewQuestionId)
                .order
            )
          }),
        }
      })
      dispatch(set(newData))
    } catch (error) {
      console.log(error)
    }
  }
}
