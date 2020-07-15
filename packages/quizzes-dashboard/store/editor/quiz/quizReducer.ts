import { Quiz, action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
  editedQuizzesDeadline,
  editedQuizzesBody,
  editedQuizzesSubmitmessage,
} from "./quizActions"
import {
  initializedEditor,
  createdNewItem,
  deletedItem,
} from "../editorActions"
import produce from "immer"
import { DateTime } from "luxon"

export const quizReducer = createReducer<{ [quizId: string]: Quiz }, action>({})
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.quizzes,
  )

  .handleAction(editedQuizTitle, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].title = action.payload.title
    })
  })

  .handleAction(editedQuizzesNumberOfTries, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].tries = action.payload.numberOfTries
    })
  })

  .handleAction(editedQuizzesPointsToGain, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].points = action.payload.pointsToGain
    })
  })

  .handleAction(editedQuizzesPointsGrantingPolicy, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].grantPointsPolicy = action.payload.policy
    })
  })

  .handleAction(editedQuizzesDeadline, (state, action) => {
    return produce(state, draftState => {
      if (action.payload.deadline !== null) {
        const deadline = DateTime.fromISO(
          action.payload.deadline.toISOString(),
        ).toLocal()
        if (deadline.isValid) {
          draftState[action.payload.id].deadline = deadline.toISO()
        }
      }
    })
  })

  .handleAction(editedQuizzesBody, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].body = action.payload.newBody
    })
  })

  .handleAction(editedQuizzesSubmitmessage, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].submitMessage =
        action.payload.newMessage
    })
  })

  .handleAction(createdNewItem, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].items.push(action.payload.itemId)
    })
  })

  .handleAction(deletedItem, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].items = draftState[
        action.payload.quizId
      ].items.filter(id => id !== action.payload.itemId)
    })
  })

export default quizReducer
