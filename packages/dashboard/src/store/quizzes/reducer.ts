import { ActionType, getType } from "typesafe-actions"
import * as quizzes from "./actions"

const initialState = {
  courseInfos: [],
  currentlySetting: new Set<string>(),
}

export interface IQuizzesState {
  courseInfos: any[]
  currentlySetting: Set<string>
}

export const quizzesReducer = (
  state: IQuizzesState = initialState,
  action: ActionType<typeof quizzes>,
) => {
  switch (action.type) {
    case getType(quizzes.startSetting):
      return {
        ...state,
        currentlySetting: state.currentlySetting.add(action.payload),
      }
    case getType(quizzes.haveBeenSet):
      const newSet = new Set(state.currentlySetting)
      newSet.delete(action.payload)
      return {
        ...state,
        currentlySetting: newSet,
      }
    case getType(quizzes.set):
      const oldInfoExists = state.courseInfos.some(
        (qi) => qi.courseId === action.payload.courseId,
      )

      if (!oldInfoExists) {
        const newCourseInfos = state.courseInfos.concat(action.payload)
        return { ...state, courseInfos: newCourseInfos }
      }
      // only updating a single quiz after saving
      if (action.payload.quizzes.length === 1) {
        const updatedQuiz = action.payload.quizzes[0]

        let newQuizzes = [
          ...state.courseInfos.find(
            (qi) => qi.courseId === action.payload.courseId,
          ).quizzes,
        ]

        if (newQuizzes.some((quiz) => quiz.id === updatedQuiz.id)) {
          newQuizzes = newQuizzes.map((q) =>
            q.id === updatedQuiz.id ? updatedQuiz : q,
          )
        } else {
          newQuizzes = newQuizzes.concat(updatedQuiz)
        }

        return {
          ...state,
          courseInfos: state.courseInfos.map((qi) => {
            return qi.courseId !== action.payload.courseId
              ? qi
              : { ...qi, quizzes: newQuizzes }
          }),
        }
      }

      // otherwise assuming that everything has been fetched from db
      return {
        ...state,
        courseInfos: state.courseInfos.map((courseQuizzes) =>
          courseQuizzes.courseId === action.payload.courseId
            ? action.payload
            : courseQuizzes,
        ),
      }

    case getType(quizzes.remove):
      return {
        ...state,
        courseInfos: state.courseInfos.map((courseQuizzes) => {
          return {
            ...courseQuizzes,
            quizzes: courseQuizzes.quizzes.filter(
              (q) => q.id !== action.payload,
            ),
          }
        }),
      }
    case getType(quizzes.clear):
      return initialState
    default:
      return state
  }
}
