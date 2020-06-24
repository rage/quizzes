import { action } from "../../../types/NormalizedQuiz"

export const resultReducer = (state: string = "", action: action) => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log(action)
      return action.payload.quiz.result
    }
    default: {
      return state
    }
  }
}

export default resultReducer
