import { QuizItem } from "@quizzes/common/models/quiz_item"
import { QuizItemTranslation } from "@quizzes/common/models/quiz_item"
import { getRepository } from "typeorm"

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
