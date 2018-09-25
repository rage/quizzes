import { getRepository } from "typeorm"
import { QuizItem } from "../../models/quiz_item"
import { QuizItemTranslation } from "../../models/quiz_item"

export const quizItemResolver = {
  async quizItem(obj: any, { id }: { id: string }, context: any, info: any) {
    const repository = getRepository(QuizItem)
    return await repository.findOne({ id })
  },

  async quizItems(obj: any, context: any, info: any) {
    const repository = getRepository(QuizItem)
    return await repository.find()
  },
}
