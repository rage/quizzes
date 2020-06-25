import { StateType, ActionType } from "typesafe-actions"
import * as editorActions from "./store/editor/editorActions"
import * as userActions from "./store/user/userActions"

const actionTypes = {
  ...editorActions,
  ...userActions,
}

export type RootAction = ActionType<typeof actionTypes>

declare module "typesafe-actions" {
  interface Types {
    RootAction: RootAction
  }
}
