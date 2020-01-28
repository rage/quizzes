import { ChangeEvent } from "react"
import {
  BaseEntity,
  Brackets,
  FindOptionsWhereCondition,
  getConnection,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import getUUIDByStringBroken from "uuid-by-string"
import fs from "fs"

import { snakeCase } from "typeorm/util/StringUtils"

export function logger(message: string) {}

export function insert<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: Array<QueryPartialEntity<T>> | QueryPartialEntity<T>,
  primaryKeys: string = `"id"`,
) {
  if (data instanceof Array && data.length === 0) {
    return
  }

  const properties = getConnection()
    .getMetadata(type)
    .columns.map(c => snakeCase(c.propertyName))

  let updateString = ""

  properties.forEach(p => {
    let property = p
    if (property === "order") {
      property = `"order"`
    }
    updateString = updateString.concat(`${property} = excluded.${property}, `)
  })

  updateString = updateString.substring(0, updateString.length - 2)

  return type
    .createQueryBuilder()
    .insert()
    .values(data)
    .onConflict(`(${primaryKeys}) do update set ${updateString}`)
    .execute()
}

/*export async function insert<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: any[],
  primaryKeys: string = `"id"`,
) {
  const saved = await Promise.all(
    data.map(async item => {
      const createdItem = type.create(item)
      try {
        return await createdItem.save()
      } catch (error) {
        try {
          console.log("error")
          await createdItem.remove()
          return await createdItem.save()
        } catch (error) {
          return createdItem
        }
      }
    }),
  )

  return saved
}*/

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
