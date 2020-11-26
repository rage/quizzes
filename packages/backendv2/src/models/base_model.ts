import { Model } from "objection"

class BaseModel extends Model {
  public updatedAt!: Date
  async $beforeUpdate(opt: any, queryContext: any) {
    await super.$beforeUpdate(opt, queryContext)
    this.updatedAt = new Date()
  }
}

export default BaseModel
