import { ActionType, getType } from "typesafe-actions"
import * as language from "./actions"
import {
  languageOptions,
  SingleLanguageLabels,
} from "../../utils/language_labels"

export type LanguageState = {
  languageId: string
  languageLabels: SingleLanguageLabels
}

const initialValue = {
  languageId: null,
  languageLabels: null,
}

export const languageReducer = (
  state: LanguageState = initialValue,
  action: ActionType<typeof language>,
): LanguageState => {
  switch (action.type) {
    case getType(language.set):
      return {
        languageId: action.payload,
        languageLabels: languageOptions[action.payload],
      }
    case getType(language.clear):
      return initialValue
    default:
      return state
  }
}
