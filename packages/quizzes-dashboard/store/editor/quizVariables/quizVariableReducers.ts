import { createReducer } from "typesafe-actions"
import { QuizVariables, action } from "../../../types/NormalizedQuiz"
import produce from "immer"
import {
  initializedEditor,
  createdNewItem,
  setTimezone,
} from "../editorActions"
import { setAddNewQuizItem, setNewItemType } from "./quizVariableActions"
import { DateTime } from "luxon"

export const quizVariableReducers = createReducer<
  { [quizId: string]: QuizVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      const init = { ...action.payload.nestedQuiz }
      const deadline =
        action.payload.normalizedQuiz.quizzes[
          action.payload.normalizedQuiz.result
        ].deadline
      let zone = DateTime.utc().zoneName
      if (deadline !== null) {
        zone = DateTime.fromISO(deadline).zoneName
      }
      draftState[action.payload.normalizedQuiz.result] = {
        initialState: init,
        addingNewItem: false,
        newItemType: "",
        newItems: [],
        deadlineTimeZone: zone,
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

  .handleAction(setTimezone, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].deadlineTimeZone =
        action.payload.timezone
    })
  })
