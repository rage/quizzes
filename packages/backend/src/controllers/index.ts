import TMCApi from "@quizzes/common/src/services/TMCApi"
import { ITMCProfile, ITMCProfileDetails } from "@quizzes/common/src/types"
import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { getRepository } from "typeorm"
import { Organization, Quiz, QuizItem } from "../models"
import quizRoute from "./quizzes"

const router = express.Router()

/**
 * GET /
 * Home page.
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  const orgs = await Organization.find()
  res.json(orgs.map(org => ({ id: org.id })))
})

/* export const userTest = asyncHandler(async (req: Request, res: Response) => {
  TMCApi.getProfile(req.params.userId)
    .then(
      (user: ITMCProfile) => (
        console.log("in userTest:", user), res.send(user)
      ),
    )
    .catch((err: { errors: string[] }) => res.send(err))
}) */

router.use("/quizzes", quizRoute)

export default router
