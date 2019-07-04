import { HeaderParam, JsonController, Post } from "routing-controllers"
import KafkaService from "services/kafka.service"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import SpamFlagService from "services/spamflag.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { Quiz, SpamFlag } from "../../models"
import { ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/quizzes/spamflag`)
export class SpamFlagController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private spamFlagService: SpamFlagService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private quizService: QuizService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private validationService: ValidationService

  @Inject()
  private kafkaService: KafkaService

  @Post("/")
  public async post(
    @EntityFromBody() spamFlag: SpamFlag,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ) {
    spamFlag.userId = user.id

    const quizAnswer = await this.quizAnswerService.getAnswer(
      {
        id: spamFlag.quizAnswerId,
      },
      this.entityManager,
    )
    const quiz: Quiz = (await this.quizService.getQuizzes({
      id: quizAnswer.quizId,
      course: true,
    }))[0]
    const userquizstate = await this.userQuizStateService.getUserQuizState(
      quizAnswer.userId,
      quizAnswer.quizId,
    )
    userquizstate.spamFlags += 1
    let response
    await this.entityManager.transaction(async manager => {
      const validated = await this.validationService.validateEssayAnswer(
        quiz,
        quizAnswer,
        userquizstate,
      )
      const updatedAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        validated.quizAnswer,
      )
      const updatedState = await this.userQuizStateService.createUserQuizState(
        manager,
        validated.userQuizState,
      )
      response = await this.spamFlagService.createSpamFlag(manager, spamFlag)
      this.kafkaService.publishQuizAnswerUpdated(
        updatedAnswer,
        updatedState,
        quiz,
      )
    })
    return response
  }
}
