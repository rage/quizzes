import { action, Option } from "../../../types/NormalizedQuiz"
import { createReducer } from "typesafe-actions"
import { editedOptionTitle, editedOptionCorrectnes } from "./optionActions"
import { initializedEditor } from "../editorActions"
import produce from "immer"

export const optionReducer = createReducer<
  { [optionId: string]: Option },
  action
>({})
  .handleAction(
    initializedEditor,
    (_state, action) => action.payload.quiz.options ?? {},
  )

  .handleAction(editedOptionTitle, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].title = action.payload.newTitle
    })
  })

  .handleAction(editedOptionCorrectnes, (state, action) => {
    return produce(state, draftState => {
      draftState[action.payload.optionId].correct = !draftState[
        action.payload.optionId
      ].correct
    })
  })

export default optionReducer
