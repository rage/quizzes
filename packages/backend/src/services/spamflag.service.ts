import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  SpamFlag,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"

@Service()
export default class SpamFlagService {
  public async createSpamFlag(manager: EntityManager, spamFlag: SpamFlag) {
    if (!spamFlag) {
      return
    }
    return manager.save(spamFlag)
  }
}
