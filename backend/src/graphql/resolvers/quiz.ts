import { GraphQLResolveInfo } from "graphql/type/definition"
import { getRepository } from "typeorm"
import { Quiz, QuizTranslation } from "../../models/quiz"

export const quizResolver = {
  async quiz(
    obj: any,
    { id }: { id: string },
    context: any,
    info: GraphQLResolveInfo,
  ) {
    const repository = getRepository(Quiz)
    return await repository.findOne({ id })
  },

  async quizzes(obj: any, args: any, context: any, info: any) {
    const { languageId } = args

    const repository = getRepository(Quiz)
    const quizzes: Quiz[] = await repository.find()

    /*     if (languageId) {
      quizzes = quizzes
        .map(q => {
          q.texts = q.texts.filter(t => t.languageId === languageId)
          q.items = q.items
            .then(items =>
              items
                .map(item => {
                  item.texts = item.texts.filter(t => t.languageId === languageId)

                  return item
                })
                .filter(i => i.texts.length > 0)
            )
          q.peerReviewQuestions = q.peerReviewQuestions
            .then(prs =>
              prs
                .map(pr => {
                  pr.texts = pr.texts.filter(t => t.languageId === languageId)

                  return pr
                })
                .filter(i => i.texts.length > 0)
            )
          return q
        })
        .filter(q => q.texts.length > 0)
    } */
    return quizzes
  },
}

export const quizFieldResolver = {
  texts: (
    obj: any,
    { languageId }: { languageId: string },
    context: any,
    info: any,
  ): QuizTranslation[] => {
    return languageId
      ? obj.texts.filter((qt: QuizTranslation) => qt.languageId === languageId)
      : obj.texts
  },
}
