import { createAction } from "typesafe-actions"
import { getTotalNumberOfAnswers } from "../../services/quizAnswers"
import { getOddAnswerCountsByQuizzes } from "../../services/quizzes"

export const set = createAction("answerCounts/SET", resolve => {
  return (quizzes: any[]) => resolve(quizzes)
})

export const clear = createAction("answerCounts/CLEAR")

export const decrement = createAction("answerCounts/DECREMENT", resolve => {
  return (quizId: string) => resolve(quizId)
})

export const setAnswerCounts = () => {
  return async (dispatch, getState) => {
    try {
      const data = await getOddAnswerCountsByQuizzes(getState().user)
      console.log("received data: ", data)
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
      let oldData = getState().answerCounts
      if (oldData.length === 0) {
        await dispatch(setAnswerCounts())
        oldData = getState().answerCounts
      }

      let newData
      if (!oldData.some(ci => ci.quizId === quizId)) {
        newData = oldData.concat({
          quizId: totalCountInfo.quizId,
          count: 0,
          totalCount: totalCountInfo.count,
        })
      } else {
        newData = oldData.map(countInfo => {
          if (countInfo.quizId !== totalCountInfo.quizId) {
            return countInfo
          }

          const newNode = {
            ...countInfo,
            totalCount: totalCountInfo.count,
          }
          return newNode
        })
      }
      dispatch(set(newData))
    } catch (error) {
      console.log(error)
    }
  }
}
