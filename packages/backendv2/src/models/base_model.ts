import { Model } from "objection"

class BaseModel extends Model {
  public updatedAt!: string
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }
}

export default BaseModel
