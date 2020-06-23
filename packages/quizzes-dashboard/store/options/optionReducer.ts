import { action } from "../../types/NormalizedQuiz"

export const optionReducer = (state: any = {}, action: action) => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log(action)
      return { ...action.payload.quiz.entities.options }
    }
    default: {
      return state
    }
  }
}

export default optionReducer
