import {
  BaseEntity,
  Brackets,
  FindOptionsWhereCondition,
  ObjectLiteral,
  SelectQueryBuilder,
} from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import getUUIDByStringBroken from "uuid-by-string"

export async function save<T extends BaseEntity>(
  type: typeof BaseEntity,
  data: any[],
) {
  const saved = Promise.all(
    data.map(async item => {
      return await type.create(item).save()
    }),
  )

  return saved
}

export function insert<T extends BaseEntity>(
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
