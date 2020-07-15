import { createReducer } from "typesafe-actions"
import { QuizVariables, action } from "../../../types/NormalizedQuiz"
import produce from "immer"
import { initializedEditor, createdNewItem } from "../editorActions"
import { setAddNewQuizItem, setNewItemType } from "./quizVariableActions"
import { DateTime } from "luxon"
import { editedQuizzesDeadline } from "../quiz/quizActions"

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
        ].deadline ?? ""
      draftState[action.payload.normalizedQuiz.result] = {
        initialState: init,
        addingNewItem: false,
        newItemType: "",
        newItems: [],
        deadline: deadline,
        validDeadline: true,
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

  .handleAction(editedQuizzesDeadline, (state, action) => {
    return produce(state, draftState => {
      if (!action.payload.deadline) {
        draftState[action.payload.id].validDeadline = true
        draftState[action.payload.id].deadline = ""
      }
      if (action.payload.deadline) {
        if (DateTime.fromISO(action.payload.deadline).isValid) {
          draftState[action.payload.id].validDeadline = true
        } else {
          draftState[action.payload.id].validDeadline = false
        }
        draftState[action.payload.id].deadline = action.payload.deadline ?? ""
      }
    })
  })
