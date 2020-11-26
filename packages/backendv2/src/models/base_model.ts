import { Model } from "objection"

class BaseModel extends Model {
  public updatedAt!: Date
  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

export default BaseModel
