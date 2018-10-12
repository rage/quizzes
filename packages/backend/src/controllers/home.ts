import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { getRepository } from "typeorm"
import TMCApi from "@quizzes/common/src/services/TMCApi"
import { Organization, Quiz, QuizItem } from "../models"
import { ITMCProfile, ITMCProfileDetails } from "../types"

/**
 * GET /
 * Home page.
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  const orgs = await Organization.find()
  res.json(orgs.map(org => ({ id: org.id })))
})

export const userTest = asyncHandler(async (req: Request, res: Response) => {
  TMCApi.getProfile(req.params.userId)
    .then(
      (user: ITMCProfileDetails) => (
        console.log("in userTest:", user), res.send(user)
      ),
    )
    .catch((err: { errors: string[] }) => res.send(err))
})

export const getQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const { language }: { language: string } = req.params

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
})
