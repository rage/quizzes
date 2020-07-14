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
  setTimezone,
} from "../editorActions"
import produce from "immer"
import { DateTime } from "luxon"
import { isValid } from "date-fns"

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
      if (
        action.payload.deadline !== null &&
        isValid(new Date(action.payload.deadline))
      ) {
        const withTimezone = DateTime.fromISO(
          action.payload.deadline.toISOString(),
          {
            zone: action.payload.timezone,
          },
        )
        draftState[action.payload.id].deadline = withTimezone.toISO()
      } else {
        draftState[action.payload.id].deadline = null
      }
    })
  })

  .handleAction(setTimezone, (state, action) => {
    return produce(state, draftState => {
      if (draftState[action.payload.quizId].deadline !== null) {
        const withTimezone = DateTime.fromISO(
          draftState[action.payload.quizId].deadline ?? "",
          {
            zone: action.payload.timezone,
          },
        )
        draftState[action.payload.quizId].deadline = withTimezone.toISO()
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
