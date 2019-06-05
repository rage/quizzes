import { createAction } from "typesafe-actions"
import { getTotalNumberOfAnswers } from "../../services/quizAnswers"
import { getOddAnswerCountsByQuizzes } from "../../services/quizzes"

export const set = createAction("answerCounts/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answerCounts/CLEAR")

export const setAnswerCounts = () => {
  return async (dispatch, getState) => {
    try {
      const data = await getOddAnswerCountsByQuizzes(getState().user)
      dispatch(set(data))
    } catch (error) {
      console.log(error)
    }
  }
}

export const setAllAnswersCount = (quizId: string) => {
  return async (dispatch, getState) => {
    try {
      const totalCountInfo = await getTotalNumberOfAnswers(
        quizId,
        getState().user,
      )
      const oldData = getState().answerCounts
      const newData = oldData.map(countInfo => {
        if (countInfo.quizId !== quizId) {
          return countInfo
        }
        console.log("This is the total count info: ", totalCountInfo)
        const newNode = {
          ...countInfo,
          totalCount: totalCountInfo.count,
        }
        console.log("This is the new node", newNode)
        return newNode
      })
      dispatch(set(newData))
    } catch (error) {
      console.log(error)
    }
  }
}
