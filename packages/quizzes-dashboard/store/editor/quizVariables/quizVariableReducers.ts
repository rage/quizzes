import { createReducer } from "typesafe-actions"
import { QuizVariables, action } from "../../../types/NormalizedQuiz"
import produce from "immer"
import {
  initializedEditor,
  createdNewItem,
  createdNewQuiz,
} from "../editorActions"
import { setAddNewQuizItem, setNewItemType } from "./quizVariableActions"
import { Quiz } from "../../../types/Quiz"

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
        newQuiz: false,
      }
    })
  })

  .handleAction(createdNewQuiz, (state, action) => {
    return produce(state, draftState => {
      const init: Quiz = {
        id: action.payload.quizId,
        autoConfirm: false,
        autoReject: false,
        awardPointsEvenIfWrong: false,
        body: "",
        courseId: action.payload.courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: null,
        excludedFromScore: true,
        grantPointsPolicy: "grant_whenever_possible",
        items: [],
        open: null,
        part: 0,
        peerReviews: [],
        points: 0,
        section: 0,
        submitMessage: null,
        title: "",
        tries: 1,
        triesLimited: true,
      }
      draftState[action.payload.quizId] = {
        initialState: init,
        addingNewItem: false,
        newItemType: "",
        newItems: [],
        newQuiz: true,
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
