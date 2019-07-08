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

const courses = {
  "ohjelmoinnin-mooc-2019": "38240a7b-7e64-4202-91e2-91f6d46f6198",
  "elements-of-ai": "21356a26-7508-4705-9bab-39b239862632",
  "elements-of-ai-fi": "5d1e8da2-3154-4966-aa94-2ca0406cf38a",
  "elements-of-ai-se": "5f496ecc-327a-4899-baff-2daa2b40b05f"
}

const database = Container.get(Database)

let manager: EntityManager
database.connect().then(() => {
  manager = getManager()
  createUserQuizStates()
})

const createUserQuizStates = async () => {
  const essayQuizStates: UserQuizState[] = await createEssayQuizStates()
  const openQuizStates: UserQuizState[] = await createOpenQuizStates()
  const MultipleChoiceQuizStates: UserQuizState[] = await createMultipleChoiceQuizStates()

  const all = [
    ...essayQuizStates,
    ...openQuizStates,
    ...MultipleChoiceQuizStates,
  ]

  let start = -1000
  let end = -1
  while (end !== all.length - 1) {
    start += 1000
    end += 1000
    if (end > all.length - 1) {
      end = all.length - 1
    }
    console.log("insert " + start + " through " + end)
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
    (answer: any, index: number) => {
      console.log(index + "/" + data.length)
      const userQuizState: UserQuizState = new UserQuizState()
      userQuizState.userId = answer.user_id
      userQuizState.quizId = answer.quiz_id
      userQuizState.pointsAwarded = answer.status === "confirmed" ? 1 : null
      userQuizState.peerReviewsGiven = answer.given
      userQuizState.peerReviewsReceived = answer.received
      userQuizState.spamFlags = answer.flagged
      userQuizState.tries = answer.tries
      userQuizState.status =
        answer.status === "confirmed" || answer.status === "submitted"
          ? "locked"
          : "open"
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
  where qa.quiz_id in ${open};
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
  and qa.quiz_id in ${open};
  `)
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

const createMultipleChoiceQuizStates = async (): Promise<UserQuizState[]> => {
  const data = await manager.query(`
  select
    qa.id,
    qa.quiz_id,
    qa.user_id,
    c.correct,
    t.total,
    tr.tries
  from quiz_answer qa
  join ${correctMultipleChoice} c on qa.id = c.id
  join ${total} t on qa.quiz_id = t.id
  join ${tries} tr on qa.user_id = tr.user_id and qa.quiz_id = tr.quiz_id
  where qa.status != 'deprecated'
  and qa.quiz_id in ${multipleChoice};
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

const correctMultipleChoice = `
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
  and (course_id = '21356a26-7508-4705-9bab-39b239862632'
  or course_id = '5d1e8da2-3154-4966-aa94-2ca0406cf38a'
  or course_id = '5f496ecc-327a-4899-baff-2daa2b40b05f'))
  `

const ohpeEssay = `
  (select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'essay'
  and course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198')
  `

const open = `
  (select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'open'
  and (course_id = '21356a26-7508-4705-9bab-39b239862632'
  or course_id = '5d1e8da2-3154-4966-aa94-2ca0406cf38a'
  or course_id = '5f496ecc-327a-4899-baff-2daa2b40b05f'
  or course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'))
  `

const multipleChoice = `
(select distinct(q.id)
  from quiz as q
  join quiz_item as qi on q.id = qi.quiz_id
  where type = 'multiple-choice'
  and multi != true
  and (course_id = '21356a26-7508-4705-9bab-39b239862632'
  or course_id = '5d1e8da2-3154-4966-aa94-2ca0406cf38a'
  or course_id = '5f496ecc-327a-4899-baff-2daa2b40b05f'
  or course_id = '38240a7b-7e64-4202-91e2-91f6d46f6198'))
`
