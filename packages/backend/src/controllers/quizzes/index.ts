import { Organization, Quiz, QuizItem } from "@quizzes/common/models"
import { IQuizAnswerQuery, IQuizQuery } from "@quizzes/common/types"
import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { QuizService } from "services/quiz.service"
import { QuizAnswerService } from "services/quizanswer.service"

const router = express.Router()
const quizService = QuizService.getInstance()
const quizAnswerService = QuizAnswerService.getInstance()

router.get(
  ["/:id", "/"],
  asyncHandler(async (req: Request, res: Response) => {
    const { id }: { id: string } = req.params
    const query: IQuizQuery = {
      id,
      ...req.query,
    }
    /*     const {
      course,
      language,
      items,
      options,
      peerreviews,
    } = req.query

    const query: IQuizQuery = {
      id,
      course,
      language,
      items,
      options,
      peerreviews
    } */

    const result = await quizService.getQuizzes(query)
    /*     const quiz = language
      ? await getQuizByIdByLanguage(id, req.query)
      : await getQuizById(id, req.query)

    res.json(quiz) */

    res.json(result)
  }),
)

router.get(
  ["/:quiz_id/answers"],
  asyncHandler(async (req: Request, res: Response) => {
    const { quiz_id }: { quiz_id: string } = req.params
    /*     const {
      user_id
    } = req.query */

    const query: IQuizAnswerQuery = { quiz_id, ...req.query }

    const result = await quizAnswerService.getAnswers(query)

    res.json(result)
  }),
)
/* router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { language }: { language: string } = req.query

    const repository = getRepository(Quiz)
    const quizzes: Quiz[] = await repository
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

    res.json(quizzes)
  }),
) */

export default router
