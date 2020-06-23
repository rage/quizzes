import { action } from "../../types/NormalizedQuiz"

export const itemReducer = (state: any = {}, action: action) => {
  switch (action.type) {
    case "INITIALIZED_EDITOR": {
      console.log(action)
      return { ...action.payload.quiz.entities.items }
    }
    default: {
      return state
    }
  }
}

export default itemReducer
