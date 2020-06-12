import { ChangeEvent } from "react"

export function stringContainsLongerWord(str: string, n: number): boolean {
  const words: string[] = str.split(" ")
  return words.some((w) => w.length > n)
}

export function wordCount(str: string | null): number {
  if (!str) {
    return 0
  }

  const words: string[] | null = str.match(/[^\s]+/g)

  return words ? words.length : 0
}

export function firstWords(str: string, n: number): string {
  const words: string[] | null = str.match(/[^\s]+/g)
  if (words === null) {
    return ""
  }

  return words.splice(0, n).join(" ")
}

export function executeIfChangeMatches(
  test: (e: ChangeEvent<HTMLInputElement>) => boolean,
  failingDefaultValue: string | null = null,
) {
  return (
    callback: (event: ChangeEvent<HTMLInputElement>) => void,
  ): ((e: ChangeEvent<HTMLInputElement>) => void) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (test(event)) {
        callback(event)
      } else if (failingDefaultValue) {
        event.target.value = failingDefaultValue
        callback(event)
      }
    }
  }
}

export function executeIfOnlyDigitsInTextField(
  callback: (event: ChangeEvent<HTMLInputElement>) => void,
): (e: ChangeEvent<HTMLInputElement>) => void {
  return executeIfChangeMatches((e: ChangeEvent<HTMLInputElement>) => {
    const eventValue = e.target.value
    const regex = eventValue.match(/^\d*$/)
    return regex ? regex.length === 1 : false
  }, "0")(callback)
}

export function executeIfTextFieldBetweenNumOfWords(
  callback: (event: ChangeEvent<HTMLInputElement>) => void,
  prevText: string,
  maxWords: number | null,
) {
  return executeIfChangeMatches((e: ChangeEvent<HTMLInputElement>) => {
    if (maxWords == null) {
      return true
    }
    const wordsInChange: number = wordCount(e.target.value)
    if (wordsInChange < maxWords) {
      return true
    } else if (wordsInChange === maxWords) {
      if (
        e.target.value.length <= prevText.length ||
        e.target.value.substr(prevText.length).trim().length !== 0
      ) {
        return true
      }
    }
    return false
  })(callback)
}
