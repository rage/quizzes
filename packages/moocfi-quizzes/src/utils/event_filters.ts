import { wordCount } from "./string_tools"
import { MiscEvent } from "../modelTypes"

type EventPredicate = (event: MiscEvent) => boolean

type EventFunction = (event: MiscEvent) => any

const executeIfChangeMatches = (test: EventPredicate) => (
  callback: EventFunction,
) => (event: MiscEvent) => {
  if (test(event)) {
    callback(event)
  }
}

export const executeIfOnlyDigitsInTextField = (callback: EventFunction) =>
  executeIfChangeMatches(e => e.currentTarget.value.match(/^\d*$ /) !== null)(
    callback,
  )

export const executeIfTextFieldBetweenNumOfWords = (
  callback: EventFunction,
  prevText: string,
  maxWords: number,
) =>
  executeIfChangeMatches(e => {
    if (maxWords === null) {
      return true
    }
    const wordsInChange = wordCount(e.currentTarget.value)
    if (wordsInChange < maxWords) {
      return true
    } else if (wordsInChange === maxWords) {
      if (
        e.currentTarget.value.length <= prevText.length ||
        e.currentTarget.value.substr(prevText.length).trim().length !== 0
      ) {
        return true
      }
    }
    return false
  })(callback)
