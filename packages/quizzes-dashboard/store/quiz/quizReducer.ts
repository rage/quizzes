import { action } from "../../types/NormalizedQuiz"

export const quizReducer = (state: any = {}, action: action) => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log(action)
      return { ...action.payload.quiz.entities.quiz }
    }
    default: {
      return state
    }
  }
}

export default quizReducer
