import { createReducer } from "typesafe-actions"
import {
  action,
  peerReviewVariables as peerReviewCollectionVariables,
} from "../../../types/NormalizedQuiz"
import { initializedEditor } from "../editorActions"
import produce from "immer"
import { createdNewPeerReviewQuestion } from "../questions/questionActions"
import { createdNewPeerReview as createdNewPeerReviewCollection } from "../peerReviewCollections/peerReviewCollectionActions"

export const peerReviewVariablesReducer = createReducer<
  { [peerReviewCollectionId: string]: peerReviewCollectionVariables },
  action
>({})
  .handleAction(initializedEditor, (state, action) => {
    return produce(state, draftState => {
      for (const peerReviewCollection in action.payload.normalizedQuiz
        .peerReviewCollections) {
        draftState[peerReviewCollection] = { newQuestions: [] }
      }
    })
  })

  .handleAction(createdNewPeerReviewCollection, (state, action) => {
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
