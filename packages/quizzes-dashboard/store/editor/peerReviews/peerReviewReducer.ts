import { createReducer } from "typesafe-actions"
import { action, NormalizedPeerReview } from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import {
  editedPeerReviewTitle,
  editedPeerReviewBody,
  createdNewPeerReview,
  deletedPeerReview,
} from "./peerReviewActions"
import produce from "immer"
import { deletedQuestion } from "../questions/questionActions"

export const peerReviewReducer = createReducer<
  { [peerReviewId: string]: NormalizedPeerReview },
  action
>({})
  .handleAction(
    initializedEditor,
    (state, action) => action.payload.normalizedQuiz.peerReviews,
  )

  .handleAction(editedPeerReviewTitle, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.peerReviewId].title = action.payload.newTitle
    })
  })

  .handleAction(editedPeerReviewBody, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.peerReviewId].body = action.payload.newBody
    })
  })

  .handleAction(createdNewPeerReview, (state, action) => {
    return produce(state, draftState => {
      const newPeerReview: NormalizedPeerReview = {
        id: action.payload.newId,
        quizId: action.payload.quizId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: "",
        body: "",
        questions: [],
      }
      draftState[action.payload.newId] = newPeerReview
    })
  })

  .handleAction(deletedPeerReview, (state, action) => {
    return produce(state, draftState => {
      delete draftState[action.payload.peerReviewId]
    })
  })

  .handleAction(deletedQuestion, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.peerReviewId].questions = draftState[
        action.payload.peerReviewId
      ].questions.filter(id => id !== action.payload.questionId)
    })
  })
