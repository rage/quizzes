import { ModelObject } from "objection"
import BaseModel from "./base_model"

class Language extends BaseModel {
  static get tableName() {
    return "language"
  }

  static async getAll() {
    const languages = await this.query()
    return languages
  }
}

export type LanguageType = ModelObject<Language>

export default Language
