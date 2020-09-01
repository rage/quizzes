import { createReducer } from "typesafe-actions"
import { action, peerReviewVariables } from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import produce from "immer"
import { createdNewPeerReviewQuestion } from "../questions/questionActions"
import { createdNewPeerReview } from "../peerReviews/peerReviewActions"

export const peerReviewVariablesReducer = createReducer<
  { [peerReviewId: string]: peerReviewVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      for (const peerReview in action.payload.normalizedQuiz.peerReviews) {
        draftState[peerReview] = { newQuestions: [] }
      }
    })
  })

  .handleAction(createdNewPeerReview, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.newId] = { newQuestions: [] }
    })
  })

  .handleAction(createdNewPeerReviewQuestion, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.peerReviewCollectionId].newQuestions.push(
        action.payload.newId,
      )
    })
  })
