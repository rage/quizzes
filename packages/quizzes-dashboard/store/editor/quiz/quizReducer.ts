import { Quiz, action } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import {
  editedQuizTitle,
  editedQuizzesNumberOfTries,
  editedQuizzesPointsToGain,
  editedQuizzesPointsGrantingPolicy,
  editedQuizzesDeadline,
} from "./quizActions"
import { initializedEditor } from "../editorActions"

export const quizReducer = createReducer<{ [quizId: string]: Quiz }, action>({})
  .handleAction(
    initializedEditor,
    (_quizzes, action) => action.payload.quiz.quizzes,
  )

  .handleAction(editedQuizTitle, (quizzes, action) => {
    console.log(quizzes)
    console.log(action)
    let newState = quizzes
    newState[action.payload.id].title = action.payload.title
    return newState
  })

  .handleAction(editedQuizzesNumberOfTries, (state, action) => {
    let newState = state
    newState[action.payload.id].tries = action.payload.numberOfTries
    return newState
  })

  .handleAction(editedQuizzesPointsToGain, (state, action) => {
    let newState = state
    newState[action.payload.id].points = action.payload.pointsToGain
    return newState
  })

  .handleAction(editedQuizzesPointsGrantingPolicy, (state, action) => {
    let newState = state
    newState[action.payload.id].grantPointsPolicy = action.payload.policy
    return newState
  })

  .handleAction(editedQuizzesDeadline, (state, action) => {
    let newState = state
    newState[action.payload.id].deadline = action.payload.deadline
    return newState
  })

export default quizReducer
