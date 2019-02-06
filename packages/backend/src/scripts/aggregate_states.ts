import { Database } from "@quizzes/common/config/database"
import { UserQuizState } from "@quizzes/common/models/user_quiz_state"
import { Container } from "typedi"
import { getManager } from "typeorm"

const database = Container.get(Database)

database.connect().then(() => aggregateAndInsert())

const aggregateAndInsert = async () => {
  const manager = getManager()
  await aggregateAndInsertEssayQuizState(manager)
}

const aggregateAndInsertEssayQuizState = async (manager: any) => {
  const answers = await manager.query(
    // tslint:disable-next-line:max-line-length
    "select qa.id, status, qa.user_id, qa.quiz_id, coalesce(s.sadface, 0) as sadface, coalesce(s.total, 0) as total, coalesce(g.given, 0) as given, coalesce(r.received, 0) as received, coalesce(spam.flagged, 0) as flagged from quiz_answer as qa left outer join (select quiz_answer_id, count(case when value = 1 then 1 end) as sadface, count(value) as total from peer_review as pr join peer_review_question_answer as prqa on pr.id = prqa.peer_review_id join peer_review_question as prq on prqa.peer_review_question_id = prq.id where type = 'grade' group by quiz_answer_id) as s on qa.id = s.quiz_answer_id  left join (select pr.user_id, qa.quiz_id, count(pr.id) as given from quiz_answer as qa join peer_review as pr on qa.id = pr.quiz_answer_id group by pr.user_id, qa.quiz_id) as g on qa.quiz_id = g.quiz_id and qa.user_id = g.user_id left outer join (select quiz_answer_id, count(user_id) as flagged from spam_flag group by quiz_answer_id) as spam on qa.id = spam.quiz_answer_id  left outer join (select quiz_answer_id, count(id) as received from peer_review group by quiz_answer_id) as r on qa.id = r.quiz_answer_id where status != 'deprecated' and qa.quiz_id in (select distinct(q.id) from quiz as q join quiz_item as qi on q.id = qi.quiz_id where type = 'essay' and course_id = '21356a26-7508-4705-9bab-39b239862632');",
  )

  const answer = answers[0]
  console.log(answer)
  const uqt = await manager.query(
    // tslint:disable-next-line:max-line-length
    "insert into user_quiz_state (user_id, quiz_id, peer_reviews_given, peer_reviews_received, points, normalized_points, tries, status) " +
      // tslint:disable-next-line:max-line-length
      `values (${answer.user_id}, '${answer.quiz_id}', ${answer.given}, ${
        answer.received
      }, 1, 1, 1, 'locked')`,
  )
  console.log(uqt)
  /*const userQuizStates = answers.map((answer: any) => {
        const userQuizState: UserQuizState = {
            quizId: answer.quiz_id,
            userId: answer.user_id,
            peerReviewsGiven: answer.given,
            peerReviewsReceived: 0,
            points: 0,
            normalizedPoints: 0,
            tries: 0,
            status: "locked"
        }
    })*/
}
