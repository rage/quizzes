import ProgressBar from "progress"
import getUUIDByStringBroken from "uuid-by-string"

export function getUUIDByString(str: string): string {
  return getUUIDByStringBroken("_" + str).toLowerCase()
}

export function safeGet<T>(func: () => T, def?: any): T {
  try {
    return func()
  } catch (e) {
    return def
  }
}

export function progressBar(message: string, total: number) {
  return new ProgressBar(
    message +
      "... :percent [:bar] (:current/:total, :elapseds elapsed / :etas remaining)",
    {
      total,

      complete: "█",
      incomplete: " ",
    },
  )
}
