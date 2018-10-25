import { BaseEntity } from "typeorm"
import { QueryPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import getUUIDByStringBroken from "uuid-by-string"

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
