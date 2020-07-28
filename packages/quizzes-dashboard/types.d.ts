import { StateType, ActionType } from "typesafe-actions"
import * as editorActions from "./store/editor/editorActions"
import * as itemActions from "./store/editor/items/itemActions"
import * as optionActions from "./store/editor/options/optionActions"
import * as quizActions from "./store/editor/quiz/quizActions"
import * as resultActions from "./store/editor/result/resultActions"

const actionTypes = {
  ...editorActions,
  ...itemActions,
  ...optionActions,
  ...quizActions,
  ...resultActions,
}

export type RootAction = ActionType<typeof actionTypes>

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction
  }
}
