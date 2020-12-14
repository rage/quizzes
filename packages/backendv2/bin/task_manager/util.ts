import { CustomError } from "../../src/util/error"

export const sleep_ms = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("")
    }, ms)
  })
}

export class Abort extends CustomError {}
