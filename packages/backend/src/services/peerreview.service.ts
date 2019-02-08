import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"

@Service()
export default class PeerReviewService {
  @InjectManager()
  private entityManager: EntityManager

  public async createPeerReview(
    manager: EntityManager,
    peerReview: PeerReview,
  ) {
    return await manager.save(peerReview)
  }

  public async getPeerReviews(manager: EntityManager, quizAnswerId: string) {
    return await manager
      .createQueryBuilder(PeerReview, "peer_review")
      .innerJoinAndSelect("peer_review.answers", "peer_review_question_answer")
      .innerJoin(
        "peer_review_question_answer.peerReviewQuestion",
        "peer_review_question",
      )
      .where("peer_review.quiz_answer_id = :id", { id: quizAnswerId })
      .andWhere("peer_review_question.type = :type", { type: "grade" })
      .getMany()
  }

  public async getAnswersToReview(id: string, answerer: string) {
    const stuff: QuizAnswer = await this.entityManager.query(
      // tslint:disable-next-line:max-line-length
      "select * from quiz_answer join quiz_item_answer on quiz_answer.id = quiz_item_answer.quiz_answer_id where quiz_id = '3c954097-268f-44bf-9d2e-1efaf9e8f122' and user_id = '73876';",
    )
    console.log(stuff)
  }
}
