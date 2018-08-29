import ProgressBar from "progress"
import { BaseEntity } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import getUUIDByStringBroken from "uuid-by-string"

export function getUUIDByString(str: string): string {
  // getUUIDByStringBroken seems to ignore the first character of the string
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
      " :percent [:bar] (:current/:total, :rate/s, :elapseds elapsed / :etas remaining)",
    {
      total,

      complete: "█",
      incomplete: " ",
    },
  )
}

export function insert<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: Array<QueryPartialEntity<T>>,
  primaryKeys: string = `"id"`,
) {
  return type
    .createQueryBuilder()
    .insert()
    .values(data)
    .onConflict(`(${primaryKeys}) DO NOTHING`)
    .execute()
}
