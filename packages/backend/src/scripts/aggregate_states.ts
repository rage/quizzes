import { Database } from "@quizzes/common/config/database"
import {
  PeerReview,
  Quiz,
  QuizAnswer,
  QuizItem,
  SpamFlag,
  UserQuizState,
} from "@quizzes/common/models"
import { Container } from "typedi"
import { EntityManager, getManager } from "typeorm"

const database = Container.get(Database)

database.connect().then(() => createUserQuizStates())

const manager = getManager()

const createUserQuizStates = async () => {
  const essayQuizStates: UserQuizState[] = await createEssayQuizStates()
  const openQuizStates: UserQuizState[] = await createOpenQuizStates()
  const radioQuizStates: UserQuizState[] = await createRadioQuizStates()

  const all = [...essayQuizStates, ...openQuizStates, ...radioQuizStates]

  let start = -1000
  let end = -1
  while (end !== all.length - 1) {
    start += 1000
    end += 1000
    if (end > all.length - 1) {
      end = all.length - 1
    }
    console.log("insert " + start + " though " + end)
    await manager
      .createQueryBuilder()
      .insert()
      .into(UserQuizState)
      .values(all.slice(start, end))
      .execute()
  }
}

const createEssayQuizStates = async (): Promise<UserQuizState[]> => {
  const data = await manager.query(`
  select
    qa.id,
    status,
    qa.user_id,
    qa.quiz_id,
    coalesce(s.sadface, 0) as sadface,
    coalesce(s.total, 0) as total,
    coalesce(g.given, 0) as given,
    coalesce(r.received, 0) as received,
    coalesce(spam.flagged, 0) as flagged,
    t.tries as tries
  from quiz_answer as qa
  left outer join ${peerreview} as s on qa.id = s.quiz_answer_id
  left outer join ${given} as g on qa.quiz_id = g.quiz_id and qa.user_id = g.user_id
  left outer join ${flagged} as spam on qa.id = spam.quiz_answer_id
  left outer join ${received} as r on qa.id = r.quiz_answer_id
  left outer join ${tries} as t on qa.user_id = t.user_id and qa.quiz_id = t.quiz_id
  where status != 'deprecated'
  and qa.quiz_id in ${elementsEssay};
  `)

  const userQuizStates: UserQuizState[] = data.map(
    (row: any, index: number) => {
      console.log(index + "/" + data.length)
      const userQuizState: UserQuizState = new UserQuizState()
      userQuizState.userId = row.user_id
      userQuizState.quizId = row.quiz_id
      userQuizState.pointsAwarded = row.status === "confirmed" ? 1 : null
      userQuizState.peerReviewsGiven = row.given
      userQuizState.peerReviewsReceived = row.received
      userQuizState.spamFlags = row.flagged
      userQuizState.tries = row.tries
      userQuizState.status =
        row.status === "confirmed" || "submitted" ? "locked" : "open"
      return userQuizState
    },
  )
  return userQuizStates
}

const createOpenQuizStates = async () => {
  const answerData = await manager.query(`
  select qa.id, text_data, validity_regex
  from quiz_answer qa
  join quiz_item_answer qia on qa.id = qia.quiz_answer_id
  join quiz_item qi on qia.quiz_item_id = qi.id
  where qa.quiz_id in ${elementsOpen};
  `)
  const validation: any = {}
  answerData.map((row: any) => {
    if (!validation[row.id]) {
      validation[row.id] = { correct: 0, total: 0 }
    }
    const correct = validation[row.id].correct
    validation[row.id].correct = new RegExp(row.validity_regex).test(
      row.text_data.trim().toLowerCase(),
    )
      ? correct + 1
      : correct
    validation[row.id].total += 1
  })
  const data = await manager.query(`
  select
    qa.id,
    status,
    qa.user_id,
    qa.quiz_id,
    t.tries as tries
  from quiz_answer as qa
  left outer join ${tries} as t on qa.user_id = t.user_id and qa.quiz_id = t.quiz_id
  where status != 'deprecated'
  and qa.quiz_id in ${elementsOpen};
  `)
  console.log(data[0])
  const userQuizStates: UserQuizState[] = data.map(
    (row: any, index: number) => {
      console.log(index + "/" + data.length)
      const userQuizState: UserQuizState = new UserQuizState()
      userQuizState.userId = row.user_id
      userQuizState.quizId = row.quiz_id
      userQuizState.pointsAwarded =
        validation[row.id].correct / validation[row.id].total
      userQuizState.tries = row.tries
      userQuizState.status = "locked"
      return userQuizState
    },
  )
  return userQuizStates
}

const createRadioQuizStates = async (): Promise<UserQuizState[]> => {
  const data = await manager.query(`
  select
    qa.id,
    qa.quiz_id,
    qa.user_id,
    c.correct,
    t.total,
    tr.tries
  from quiz_answer qa
  join ${correctRadio} c on qa.id = c.id
  join ${total} t on qa.quiz_id = t.id
  join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
  where qa.status != 'deprecated'
  and qa.quiz_id in ${elementsRadio};
  `)
  const userQuizStates: UserQuizState[] = data.map(
    (row: any, index: number) => {
      console.log(index + "/" + data.length)
      const userQuizState: UserQuizState = new UserQuizState()
      userQuizState.userId = row.user_id
      userQuizState.quizId = row.quiz_id
      userQuizState.pointsAwarded = row.correct / row.total
      userQuizState.tries = row.tries
      userQuizState.status = "locked"
      return userQuizState
    },
  )
  return userQuizStates
}

const correctRadio = `
(select qa.id, count(qia.id) correct
from quiz_answer qa
join quiz_item_answer qia on qa.id = qia.quiz_answer_id
join quiz_option_answer qoa on qia.id = qoa.quiz_item_answer_id
join quiz_option qo on qoa.quiz_option_id = qo.id
where qo.correct = true
group by qa.id)
`
const total = `
(select q.id, count(qi.id) total
from quiz q
join quiz_item qi on q.id = qi.quiz_id
group by q.id)
`

const peerreview = `
  (select quiz_answer_id, count(case when value = 1 then 1 end) as sadface, count(value) as total
  from peer_review as pr
  join peer_review_question_answer as prqa on pr.id = prqa.peer_review_id
  join peer_review_question as prq on prqa.peer_review_question_id = prq.id
  where type = 'grade'
  group by quiz_answer_id)
  `

const given = `
  (select pr.user_id, qa.quiz_id, count(pr.id) as given
  from quiz_answer as qa
  join peer_review as pr on qa.id = pr.quiz_answer_id
  group by pr.user_id, qa.quiz_id)
  `

const flagged = `
  (select quiz_answer_id, count(user_id) as flagged
  from spam_flag
  group by quiz_answer_id)
  `

const received = `
  (select quiz_answer_id, count(id) as received
  from peer_review
  group by quiz_answer_id)
  `

const tries = `
  (select user_id, quiz_id, count(id) as tries
  from quiz_answer
  group by user_id, quiz_id)
  `

const elementsEssay = `
  (select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'essay'
  and course_id = '21356a26-7508-4705-9bab-39b239862632')
  `

const elementsOpen = `
  (select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'open'
  and course_id = '21356a26-7508-4705-9bab-39b239862632')
  `

const elementsRadio = `
(select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'radio'
  and multi != true
  and course_id = '21356a26-7508-4705-9bab-39b239862632')
`

/*const createUserQuizStates = async () => {
  console.time()
  const manager: EntityManager = getManager()
  const quizAnswers: QuizAnswer[] = await manager
    .createQueryBuilder(QuizAnswer, "quiz_answer")
    .getMany()
  const quizzes: Quiz[] = await manager
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
    .getMany()
  const peerReviews: PeerReview[] = await manager
    .createQueryBuilder(PeerReview, "peer_review")
    .getMany()
  const spamFlags: SpamFlag[] = await manager
    .createQueryBuilder(SpamFlag, "spam_flag")
    .getMany()
  const userQuizStates: UserQuizState[] = []
  const updatedQuizAnswers: QuizAnswer[] = []
  quizAnswers.map((quizAnswer, index) => {
    console.log(index + 1, "/", quizAnswers.length)
    const quiz: Quiz = quizzes.find(q => q.id === quizAnswer.quizId)
    let userQuizState: UserQuizState = userQuizStates.find(
      uqs => uqs.userId === quizAnswer.userId && uqs.quizId === quiz.id,
    )
    if (!userQuizState) {
      userQuizState = new UserQuizState()
      userQuizState.quizId = quiz.id
      userQuizState.userId = quizAnswer.userId
      userQuizState.status = "locked"
      userQuizStates.push(userQuizState)
    }
    userQuizState.tries += 1
    const status = quizAnswer.status
    if (status === "deprecated") {
      return
    }
    let correct = 0
    quizAnswer.itemAnswers.map(itemAnswer => {
      const quizItem: QuizItem = quiz.items.find(
        item => item.id === itemAnswer.quizItemId,
      )
      switch (quizItem.type) {
        case "essay":
          const flagged = spamFlags.filter(
            sf => sf.quizAnswerId === quizAnswer.id,
          )
          const reviewsReceived = peerReviews.filter(
            pr => pr.quizAnswerId === quizAnswer.id,
          )
          const reviewsGiven = peerReviews.filter(
            pr =>
              pr.userId === quizAnswer.userId &&
              quizAnswers.find(qa => qa.id === pr.quizAnswerId).quizId ===
                quiz.id,
          )
          userQuizState.spamFlags = flagged.length
          userQuizState.peerReviewsReceived = reviewsReceived.length
          userQuizState.peerReviewsGiven = reviewsGiven.length
          if (status === "confirmed") {
            userQuizState.pointsAwarded = 1
          } else if (status === "spam" || "rejected") {
            userQuizState.status = "open"
          } else if (status === "submitted") {
            if (userQuizState.spamFlags > 3) {
              quizAnswer.status = "spam"
              userQuizState.status = "open"
              updatedQuizAnswers.push(quizAnswer)
            } else if (
              userQuizState.peerReviewsReceived >= 2 &&
              userQuizState.peerReviewsGiven >= 3
            ) {
              const total =
                quiz.peerReviewQuestionCollections[0].questions.filter(
                  prq => prq.type === "grade",
                ).length * reviewsReceived.length
              let negative = 0
              reviewsReceived.map(review => {
                negative += review.answers.filter(answer => answer.value === 1)
                  .length
              })
              if (negative / total <= 0.35) {
                quizAnswer.status = "confirmed"
                userQuizState.pointsAwarded = 1
                updatedQuizAnswers.push(quizAnswer)
              } else {
                quizAnswer.status = "rejected"
                userQuizState.status = "open"
                updatedQuizAnswers.push(quizAnswer)
              }
            }
          }
          break
        case "open":
          const validator = new RegExp(quizItem.validityRegex)
          if (validator.test(itemAnswer.textData)) {
            correct += 1
          }
          break
        case "radio":
          itemAnswer.optionAnswers.map(oa => {
            if (
              quiz.items
                .find(item => item.id === itemAnswer.quizItemId)
                .options.find(option => option.id === oa.quizOptionId).correct
            ) {
              correct += 1
              return
            }
          })
          break
        case "checkbox":
          break
        default:
      }
    })
    userQuizState.pointsAwarded = correct / quizAnswer.itemAnswers.length
  })
  console.log(userQuizStates.length)
  console.log(updatedQuizAnswers.length)
  await manager.insert(UserQuizState, userQuizStates)
  console.log("answers iserted")
  await Promise.all(
    updatedQuizAnswers.map(async updated => {
      await manager.save(QuizAnswer, updated)
    }),
  )
  console.log("updated answers: ", updatedQuizAnswers.length)
  console.timeEnd()
  }*/
