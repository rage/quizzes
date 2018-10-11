import { getRepository } from "typeorm"
import { QuizItemTranslation } from "../../models/quiz_item"

export const quizItemTranslationResolver = {
  async quizItemTranslation(
    obj: any,
    { quizItemId, languageId }: { quizItemId: string; languageId: string },
    context: any,
    info: any,
  ) {
    const repository = getRepository(QuizItemTranslation)
    return await repository.findOne({ quizItemId, languageId })
  },

  async quizItemTranslations(
    obj: any,
    { quizItemId }: { quizItemId: string },
    context: any,
    info: any,
  ) {
    const repository = getRepository(QuizItemTranslation)
    return await repository.find({ quizItemId })
  },
}
