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
    await manager.save(peerReview)
  }

  public async validateEssayAnswer(
    manager: EntityManager,
    quiz: Quiz,
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
  ) {
    const course: Course = quiz.course
    const given: number = userQuizState.peerReviewsGiven
    const received: number = userQuizState.peerReviewsReceived
    if (
      given >= course.minPeerReviewsGiven &&
      received >= course.minPeerReviewsReceived
    ) {
      const peerReviews = await this.getPeerReviews(manager, quizAnswer.id)
      let sadFaces: number = 0
      let total: number = 0
      peerReviews.map(pr => {
        pr.answers.map(answer => {
          if (answer.value === 1) {
            sadFaces += 1
          }
          total += 1
        })
      })
      if (sadFaces / total <= course.maxNegativeReviewPercentage) {
        quizAnswer.status = "confirmed"
        userQuizState.points = 1
        userQuizState.normalizedPoints = 1
      } else {
        quizAnswer.status = "rejected"
        userQuizState.points = 0
        userQuizState.normalizedPoints = 0
        userQuizState.status = "open"
      }
    }
    return { quizAnswer, userQuizState }
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
