import { Language } from "@quizzes/common/models/language"
import { getRepository } from "typeorm"

export const languageResolver = {
  async language(obj: any, { id }: { id: string }, context: any, info: any) {
    const repository = getRepository(Language)
    return await repository.findOne({ id })
  },
}
