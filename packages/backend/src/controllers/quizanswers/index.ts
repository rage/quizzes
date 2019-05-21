import {
  HeaderParam,
  JsonController,
  Post,
  BadRequestError,
} from "routing-controllers"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import UserCourseStateService from "services/usercoursestate.service"
import UserQuizStateService from "services/userquizstate.service"
import ValidationService from "services/validation.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"
import { API_PATH } from "../../config"
import { Quiz, QuizAnswer, User, UserQuizState } from "../../models"
import { ITMCProfileDetails } from "../../types"

@JsonController(`${API_PATH}/quizzes/answer`)
export class QuizAnswerController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private userCourseStateService: UserCourseStateService

  @Inject()
  private quizService: QuizService

  @Inject()
  private validationService: ValidationService

  @Post("/")
  public async post(
    @EntityFromBody() answer: QuizAnswer,
    @HeaderParam("authorization") user: ITMCProfileDetails,
  ): Promise<any> {
    answer.userId = user.id
    // creates new user if necessary
    answer.user = new User()
    answer.user.id = answer.userId

    const quiz: Quiz[] = await this.quizService.getQuizzes({
      id: answer.quizId,
      items: true,
      options: true,
      peerreviews: true,
      course: true,
    })

    const userQState: UserQuizState = await this.userQuizStateService.getUserQuizState(
      answer.userId,
      answer.quizId,
    )

    const {
      response,
      quizAnswer,
      userQuizState,
    } = this.validationService.validateQuizAnswer(answer, quiz[0], userQState)

    const erroneousItemAnswers = response.itemAnswerStatus.filter(status => {
      return status.error ? true : false
    })

    if (erroneousItemAnswers.length > 0) {
      throw new BadRequestError(
        `${erroneousItemAnswers.map(x => {
          if (x.type === "essay") {
            return `${x.error} Min: ${x.min}, max: ${x.max}. Your answer (${
              x.data.words
            } words): ${x.data.text}`
          } else if (x.type === "scale") {
            return `${x.error} Min: ${x.min}, max: ${x.max}. Your answer: ${
              x.data.answerValue
            }`
          }
        })}`,
      )
    }
    let savedAnswer: QuizAnswer
    let savedUserQuizState: UserQuizState

    await this.entityManager.transaction(async manager => {
      await this.validationService.checkForDeprecated(manager, quizAnswer)

      savedAnswer = await this.quizAnswerService.createQuizAnswer(
        manager,
        quizAnswer,
      )

      savedUserQuizState = await this.userQuizStateService.createUserQuizState(
        manager,
        userQuizState,
      )

      if (!quiz[0].excludedFromScore && savedAnswer.status === "confirmed") {
        await this.userCourseStateService.updateUserCourseState(
          manager,
          quiz[0],
          savedUserQuizState,
          savedAnswer,
        )
      }
    })

    return {
      quiz: quiz[0],
      quizAnswer: savedAnswer,
      userQuizState: savedUserQuizState,
    }
  }
}
