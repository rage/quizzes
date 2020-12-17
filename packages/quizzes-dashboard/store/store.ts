import { createStore, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { optionReducer } from "./editor/options/optionReducer"
import { itemReducer } from "./editor/items/itemReducer"
import { quizReducer } from "./editor/quiz/quizReducer"
import { resultReducer } from "./editor/result/resultReducer"
import {
  NormalizedQuiz,
  NormalizedItem,
  NormalizedOption,
  ItemVariables,
  OptionVariables,
  QuizVariables,
  NormalizedPeerReviewCollection,
  NormalizedQuestion,
  peerReviewVariables,
} from "../types/NormalizedQuiz"
import { itemVariableReducers } from "./editor/itemVariables/itemVariableReducers"
import { optionVariableReducers } from "./editor/optionVariables/optionVariableReducers"
import { quizVariableReducers } from "./editor/quizVariables/quizVariableReducers"
import editorChangesReducer from "./editor/editorReducer"
import { peerReviewReducer } from "./editor/peerReviewCollections/peerReviewCollectionReducer"
import { questionReducer } from "./editor/questions/questionReducer"
import { peerReviewVariablesReducer } from "./editor/peerReviewVariables/peerReviewCollectionsVariablesReducer"

const editorReducer = combineReducers({
  quizzes: quizReducer,
  items: itemReducer,
  options: optionReducer,
  quizId: resultReducer,
  itemVariables: itemVariableReducers,
  optionVariables: optionVariableReducers,
  quizVariables: quizVariableReducers,
  editorChanges: editorChangesReducer,
  peerReviewCollections: peerReviewReducer,
  questions: questionReducer,
  peerReviewCollectionVariables: peerReviewVariablesReducer,
})

const reducer = combineReducers({
  editor: editorReducer,
})

const store = createStore(reducer, composeWithDevTools())

export interface storeState {
  editor: {
    quizzes: { [quizId: string]: NormalizedQuiz }
    items: { [itemId: string]: NormalizedItem }
    options: { [optionId: string]: NormalizedOption }
    quizId: string
    itemVariables: { [itemId: string]: ItemVariables }
    optionVariables: { [optionId: string]: OptionVariables }
    quizVariables: { [quizId: string]: QuizVariables }
    editorChanges: { changes: boolean }
    peerReviewCollections: {
      [peerReviewCollectionId: string]: NormalizedPeerReviewCollection
    }
    questions: { [questionId: string]: NormalizedQuestion }
    peerReviewCollectionVariables: {
      [peerReviewCollectionId: string]: peerReviewVariables
    }
  }
}

export const useTypedSelector: TypedUseSelectorHook<storeState> = useSelector

export default store
