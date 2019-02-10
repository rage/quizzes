import { Database } from "@quizzes/common/config/database"
import { Quiz, QuizAnswer, UserQuizState } from "@quizzes/common/models"
import { Container } from "typedi"
import { getManager } from "typeorm"

const database = Container.get(Database)

database.connect().then(() => createUserQuizStates())

const createUserQuizStates = async () => {
  const manager = getManager()
  // const quizAnswers = await manager.createQueryBuilder(QuizAnswer, "quiz_answer").getMany()
  // tslint:disable-next-line:max-line-length
  const quizAnswers = await manager.query(
    "select * from quiz_answer join quiz_item_answer on quiz_answer.id = quiz_item_answer.quiz_answer_id;",
  )
  /*const quizzes = await manager
    .createQueryBuilder(Quiz, "quiz")
    .leftJoinAndSelect("quiz.items", "item")
    .addSelect("item.validityRegex")
    .leftJoinAndSelect("item.options", "option")
    .addSelect("option.correct")
    .leftJoinAndSelect(
      "quiz.peerReviewQuestionCollections",
      "peer_review_question_collection",
    )
    .leftJoinAndSelect(
      "peer_review_question_collection.questions",
      "peer_review_question",
    )
    .getMany()*/
  console.log(quizAnswers.length)
  console.log(quizAnswers[1000])
}
