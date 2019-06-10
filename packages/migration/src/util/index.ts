import { ChangeEvent } from "react"
import {
  BaseEntity,
  Brackets,
  FindOptionsWhereCondition,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import getUUIDByStringBroken from "uuid-by-string"
import fs from "fs"

export function logger(message: string) {}

export async function insert<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: Array<any>,
  primaryKeys: string = `"id"`,
) {
  const saved = Promise.all(
    data.map(async item => {
      return await type.create(item).save()
    }),
  )

  return saved
}

export function insertForReal<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: Array<QueryPartialEntity<T>> | QueryPartialEntity<T>,
  primaryKeys: string = `"id"`,
) {
  if (data instanceof Array && data.length === 0) {
    return
  }

  return type
    .createQueryBuilder()
    .insert()
    .values(data)
    .onConflict(`(${primaryKeys}) DO NOTHING`)
    .execute()
}

export function getUUIDByString(str: string): string {
  // getUUIDByStringBroken seems to ignore the first character of the string
  return getUUIDByStringBroken("_" + str).toLowerCase()
}

export function randomUUID(size: number = 1000000, start: number = 0): string {
  const randomUUIDseed: string = `${Date.now()}-${Math.round(
    start + Math.random() * size,
  )}`

  return getUUIDByString(randomUUIDseed)
}

export class WhereBuilder<T extends BaseEntity> {
  private qb: SelectQueryBuilder<T>
  private idx = 0

  constructor(qb: SelectQueryBuilder<T>) {
    this.qb = qb
  }

  public add(
    condition:
      | string
      | Brackets
      | ((qb: SelectQueryBuilder<T>) => string)
      | FindOptionsWhereCondition<T>
      | Array<FindOptionsWhereCondition<T>>,
    parameters?: ObjectLiteral | undefined,
  ): WhereBuilder<T> {
    if (this.idx === 0) {
      this.qb.where(condition, parameters)
    } else {
      this.qb.andWhere(condition, parameters)
    }

    this.idx++

    return this
  }
}

export function wordCount(str: string | null): number {
  if (!str) {
    return 0
  }

  const words: string[] | null = str.match(/[^\s]+/g)

  return words ? words.length : 0
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
): ((e: ChangeEvent<HTMLInputElement>) => void) {
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
