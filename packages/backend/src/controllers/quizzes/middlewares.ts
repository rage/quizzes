import { Organization, Quiz, QuizItem } from "@quizzes/common/models"
import { IQuizQuery } from "@quizzes/common/types"
import { getRepository, SelectQueryBuilder } from "typeorm"

export const getQuizById = async (id: string, option: IQuizQuery) => {
  const { course, items, options, peerreviews } = option

  if (!id) {
    return Promise.reject()
  }

  let quizQuery: SelectQueryBuilder<Quiz> = getRepository(Quiz)
    .createQueryBuilder("quiz")
    .where("quiz.id = :id", { id })
    .leftJoinAndSelect("quiz.texts", "quiz_translation")

  quizQuery = course
    ? quizQuery.leftJoinAndSelect("quiz.course", "course")
    : quizQuery
  quizQuery = items
    ? quizQuery.leftJoinAndSelect("quiz.items", "quiz_item")
    : quizQuery
  quizQuery =
    options && items
      ? quizQuery.leftJoinAndSelect("quiz_item.options", "quiz_option")
      : quizQuery
  quizQuery = peerreviews
    ? quizQuery.leftJoinAndSelect(
        "quiz.peerReviewQuestions",
        "peer_review_question",
      )
    : quizQuery

  return await quizQuery.getOne()
}

export const getQuizByIdByLanguage = async (id: string, option: IQuizQuery) => {
  const { course, items, options, peerreviews, language } = option

  if (!id) {
    return Promise.reject()
  }

  let quizQuery: SelectQueryBuilder<Quiz> = getRepository(Quiz)
    .createQueryBuilder("quiz")
    .where("quiz.id = :id", { id })
    .leftJoinAndSelect("quiz.texts", "quiz_translation")
    .where("quiz_translation.language_id = :language", { language })

  quizQuery = course
    ? quizQuery
        .leftJoinAndSelect("quiz.course", "course")
        .leftJoinAndSelect("course.languages", "language")
        .where("language.id = :language", { language })
    : quizQuery
  quizQuery = items
    ? quizQuery
        .leftJoinAndSelect("quiz.items", "quiz_item")
        .leftJoinAndSelect(
          "quiz_item.texts",
          "quiz_item_translation",
          "quiz_item_translation.language_id = :language",
          { language },
        )
    : quizQuery
  quizQuery =
    options && items
      ? quizQuery
          .leftJoinAndSelect("quiz_item.options", "quiz_option")
          .leftJoinAndSelect(
            "quiz_option.texts",
            "quiz_option_translation",
            "quiz_option_translation.language_id = :language",
            { language },
          )
      : quizQuery
  quizQuery = peerreviews
    ? quizQuery
        .leftJoinAndSelect("quiz.peerReviewQuestions", "peer_review_question")
        .leftJoinAndSelect(
          "peer_review_question.texts",
          "peer_review_question_translation",
          "peer_review_question_translation.language_id = :language",
          { language },
        )
    : quizQuery

  return await quizQuery.getOne()
}

export const getQuizzes = async (options: { [option: string]: string }) => {
  const language: string = "en_US" // temp
  const quizzes: Quiz[] = await getRepository(Quiz)
    .createQueryBuilder("quiz")
    .leftJoinAndSelect("quiz.course", "course")
    .leftJoinAndSelect("course.languages", "language")
    .where("language.id = :language", { language })
    .leftJoinAndSelect("quiz.texts", "quiz_translation")
    // .where("quiz_translation.language_id = :language", { language })
    .leftJoinAndSelect("quiz.items", "quiz_item")
    //     .leftJoinAndSelect(
    //      "quiz_item.texts",
    //      "quiz_item_translation",
    //      "quiz_item_translation.language_id = :language", { language })
    .leftJoinAndSelect("quiz_item.options", "quiz_option")
    //     .leftJoinAndSelect(
    //      "quiz_option.texts",
    //      "quiz_option_translation",
    //      "quiz_option_translation.language_id = :language", { language })
    .leftJoinAndSelect("quiz.peerReviewQuestions", "peer_review_question")
    //     .leftJoinAndSelect(
    //      "peer_review_question.texts",
    //      "peer_review_question_translation",
    //      "peer_review_question_translation.language_id = :language", { language })
    .getMany()

  return quizzes
}
