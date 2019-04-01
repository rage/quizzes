import { wordCount } from "./string_tools"

const executeIfChangeMatches = test => callback => event => {
  if (test(event)) {
    callback(event)
  }
}

export const executeIfOnlyDigitsInTextField = callback =>
  executeIfChangeMatches(e => e.target.value.match(/^\d*$ /))(callback)

export const executeIfTextFieldBetweenNumOfWords = (
  callback,
  prevText,
  maxWords,
) =>
  executeIfChangeMatches(e => {
    if (maxWords == null) {
      return true
    }
    const wordsInChange = wordCount(e.target.value)
    if (wordsInChange < maxWords) {
      return true
    } else if (wordsInChange === maxWords) {
      if (
        e.target.value.length <= prevText.length ||
        e.target.value.substr(prevText.length).trim().length != 0
      ) {
        return true
      }
    }
    return false
  })(callback)
