import express, { Request, Response } from "express"
import { QuizAnswerService } from "services/quizanswer.service"

const router = express.Router()
const quizAnswerService = QuizAnswerService.getInstance()

export default router
