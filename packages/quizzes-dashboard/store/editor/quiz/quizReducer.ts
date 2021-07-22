import { NormalizedQuiz, action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizTriesLimited,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
  editedQuizzesDeadline,
  editedQuizzesBody,
  editedQuizzesSubmitmessage,
  editedQuizzesPart,
  editedQuizzesSection,
  editedQuizzesAutoconfirm,
} from "./quizActions"
import {
  initializedEditor,
  createdNewItem,
  deletedItem,
  createdNewQuiz,
} from "../editorActions"
import produce from "immer"
import { DateTime } from "luxon"
import { Quiz } from "../../../types/Quiz"
import { normalize } from "normalizr"
import { normalizedQuiz } from "../../../schemas"
import { createdNewPeerReview } from "../peerReviewCollections/peerReviewCollectionActions"

export const quizReducer = createReducer<
  { [quizId: string]: NormalizedQuiz },
  action
>({})
  .handleAction(
    initializedEditor,
    (_state, action) => action.payload.normalizedQuiz.quizzes,
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

  .handleAction(editedQuizTriesLimited, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.id].triesLimited = action.payload.triesLimited
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

  .handleAction(createdNewQuiz, (state, action) => {
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
      excludedFromScore: false,
      grantPointsPolicy: "grant_whenever_possible",
      items: [],
      open: null,
      part: 0,
      peerReviewCollections: [],
      points: 1,
      section: 0,
      submitMessage: null,
      title: "",
      tries: 1,
      triesLimited: true,
    }

    const normalized = normalize(init, normalizedQuiz)

    return normalized.entities.quizzes ?? {}
  })

  .handleAction(editedQuizzesPart, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].part = action.payload.newPart
    })
  })

  .handleAction(editedQuizzesSection, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].section = action.payload.newSection
    })
  })

  .handleAction(createdNewPeerReview, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].peerReviewCollections.push(
        action.payload.newId,
      )
    })
  })

  .handleAction(editedQuizzesAutoconfirm, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.quizId].autoConfirm = action.payload.autoConfirm
    })
  })

export default quizReducer
