import { createReducer } from "typesafe-actions"
import { QuizVariables, action } from "../../../types/NormalizedQuiz"
import produce from "immer"
import { initializedEditor, createdNewItem } from "../editorActions"
import { setAddNewQuizItem, setNewItemType } from "./quizVariableActions"

export const quizVariableReducers = createReducer<
  { [quizId: string]: QuizVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      const init = { ...action.payload.nestedQuiz }
      draftState[action.payload.normalizedQuiz.result] = {
        initialState: init,
        addingNewItem: false,
        newItemType: "",
        newItems: [],
      }
    })
  })

  .handleAction(setAddNewQuizItem, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].addingNewItem = action.payload.adding
    })
  })

  .handleAction(setNewItemType, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].newItemType = action.payload.type
    })
  })

  .handleAction(createdNewItem, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].newItems.push(action.payload.itemId)
    })
  })
