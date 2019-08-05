import { ActionType, getType } from "typesafe-actions"
import { Quiz } from "../../../../common/src/models/quiz"
import * as quizzes from "./actions"

export const quizzesReducer = (
  state: any[] = [],
  action: ActionType<typeof quizzes>,
) => {
  switch (action.type) {
    case getType(quizzes.set):
      const oldInfoExists = state.some(
        qi => qi.courseId === action.payload.courseId,
      )

      if (!oldInfoExists) {
        const newState = state.concat(action.payload)
        return newState
      }
      // only updating a single quiz after saving
      if (action.payload.quizzes.length === 1) {
        const updatedQuiz = action.payload.quizzes[0]

        let newQuizzes = [
          ...state.find(qi => qi.courseId === action.payload.courseId).quizzes,
        ]

        if (newQuizzes.includes(quiz => quiz.id === updatedQuiz.id)) {
          newQuizzes = newQuizzes.map(q =>
            q.id === action.payload.quizzes[0].id
              ? action.payload.quizzes[0]
              : q,
          )
        } else {
          newQuizzes = newQuizzes.concat(updatedQuiz)
        }

        newQuizzes = [
          ...state.find(qi => qi.courseId === action.payload.courseId).quizzes,
        ].map(q =>
          q.id === action.payload.quizzes[0].id ? action.payload.quizzes[0] : q,
        )
        return state.map(qi => ({
          ...qi,
          quizzes:
            qi.courseId === action.payload.courseId ? newQuizzes : qi.quizzes,
        }))
      }

      // otherwise assuming that everything has been fetched from db
      return state.map(courseQuizzes =>
        courseQuizzes.courseId === action.payload.courseId
          ? action.payload
          : courseQuizzes,
      )

    case getType(quizzes.remove):
      return state.map(courseQuizzes => {
        return {
          ...courseQuizzes,
          quizzes: courseQuizzes.quizzes.filter(q => q.id !== action.payload),
        }
      })
    case getType(quizzes.clear):
      return []
    default:
      return state
  }
}
