import { Model } from "objection"

class BaseModel extends Model {
  public createdAt!: string
  public updatedAt!: string
  async $beforeUpdate(opt: any, queryContext: any) {
    await super.$beforeUpdate(opt, queryContext)
    // this.updatedAt = new Date().toISOString()
  }
}

export default BaseModel
