import { Model, PartialModelObject, Plugin } from "objection"

/**
 * Objection plugin that makes `delete()` set `columnName` to true instead of
 * removing the row.
 */
const softDelete = ({ columnName }: { columnName: string }): Plugin =>
  ((ModelClass: typeof Model) => {
    class SoftDeleteQueryBuilder<M extends Model, R = M[]> extends ModelClass
      .QueryBuilder<M, R> {
      delete() {
        const patch = { [columnName]: true } as PartialModelObject<M>
        return this.patch(patch)
      }
    }

    return class extends ModelClass {
      static QueryBuilder = SoftDeleteQueryBuilder
    }
  }) as Plugin

export default softDelete
