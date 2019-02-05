import { Quiz, QuizAnswer } from "@quizzes/common/models"
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  QueryParam,
  QueryParams,
} from "routing-controllers"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserQuizStateService from "services/userquizstate.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

@JsonController("/quizzes/answer")
export class QuizAnswerController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private quizService: QuizService

  @Post("/")
  public async post(@EntityFromBody() answer: QuizAnswer): Promise<any> {
    const quiz: Quiz[] = await this.quizService.getQuizzes({
      id: answer.quizId,
      items: true,
      options: true,
    })
    const userQState = await this.userQuizStateService.getUserQuizState(
      answer.userId,
      answer.quizId,
    )
    const {
      response,
      quizAnswer,
      userQuizState,
    } = await this.quizAnswerService.validateQuizAnswer(
      answer,
      quiz[0],
      userQState,
    )
    await this.userQuizStateService.createUserQuizState(userQuizState)
    await this.quizAnswerService.checkForDeprecated(quizAnswer)
    await this.quizAnswerService.createQuizAnswer(quizAnswer)
    return response
  }
}
