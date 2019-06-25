import { ActionType, getType } from "typesafe-actions"
import * as language from "./actions"

export type LanguageState = {
  languageId: string
  languageLabels: object
}

const initialValue = {
  languageId: null,
  languageLabels: null,
}

export const languageReducer = (
  state: LanguageState = initialValue,
  action: ActionType<typeof language>,
) => {
  switch (action.type) {
    case getType(language.set):
      return {
        ...state,
        languageId: action.payload,
      }
    case getType(language.clear):
      return initialValue
    default:
      return state
  }
}
