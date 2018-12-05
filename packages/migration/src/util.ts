import ProgressBar from "progress"

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
      " :percent [:bar] (:current/:total, :rate/s, :elapseds elapsed / :etas remaining)",
    {
      total,

      complete: "█",
      incomplete: " ",
    },
  )
}

export function calculateChunkSize(dataExample: object): number {
  if (!dataExample) {
    return 65535
  }
  return Math.floor(65535 / Object.entries(dataExample).length) - 1
}
