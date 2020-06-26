import { action, Option } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import { editedOptionTitle, editedOptionCorrectnes } from "./optionActions"
import { initializedEditor } from "../editorActions"

export const optionReducer = createReducer<
  { [optionId: string]: Option },
  action
>({})
  .handleAction(
    initializedEditor,
    (_state, action) => action.payload.quiz.options ?? {},
  )

  .handleAction(editedOptionTitle, (state, action) => {
    let newState = state
    newState[action.payload.optionId].title = action.payload.newTitle
    return newState
  })

  .handleAction(editedOptionCorrectnes, (state, action) => {
    let newState = state
    newState[action.payload.optionId].correct = !newState[
      action.payload.optionId
    ].correct
    return newState
  })

export default optionReducer
