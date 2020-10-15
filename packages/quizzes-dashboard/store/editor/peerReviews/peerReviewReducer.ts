import { createReducer } from "typesafe-actions"
import { action, NormalizedPeerReview } from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import {
  editedPeerReviewTitle,
  editedPeerReviewBody,
  createdNewPeerReview,
} from "./peerReviewActions"
import produce from "immer"
import { createdNewPeerReviewQuestion } from "../questions/questionActions"

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

  .handleAction(createdNewPeerReviewQuestion, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.peerReviewCollectionId].questions.push(
        action.payload.newId,
      )
    })
  })
