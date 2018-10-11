import { getRepository } from "typeorm"
import { Language } from "../../models/language"

export const languageResolver = {
  async language(obj: any, { id }: { id: string }, context: any, info: any) {
    const repository = getRepository(Language)
    return await repository.findOne({ id })
  },
}
