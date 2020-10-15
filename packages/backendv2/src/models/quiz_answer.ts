import Knex from "knex"
import Model from "./base_model"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
import { UserInfo } from "../types"
import PeerReview from "./peer_review"
import Quiz from "./quiz"
import UserQuizState from "./user_quiz_state"
import { BadRequestError } from "../util/error"
import { removeNonPrintingCharacters } from "../util/tools"
import knex from "../../database/knex"
import Course from "./course"
import PeerReviewQuestion from "./peer_review_question"
import UserCoursePartState from "./user_course_part_state"
import * as Kafka from "../services/kafka"

type QuizAnswerStatus =
  | "draft"
  | "given-more-than-enough"
  | "given-enough"
  | "manual-review-once-given-and-received-enough"
  | "manual-review-once-given-enough"
  | "manual-review-once-received-enough"
  | "manual-review-once-received-enough-given-more-than-enough"
  | "submitted"
  | "manual-review"
  | "confirmed"
  | "enough-received-but-not-given"
  | "spam"
  | "rejected"
  | "deprecated"

class QuizAnswer extends Model {
  id!: string
  userId!: number
  quizId!: string
  languageId!: string
  status!: QuizAnswerStatus
  itemAnswers!: QuizItemAnswer[]
  user!: User
  peerReviews!: PeerReview[]
  userQuizState!: UserQuizState
  quiz!: Quiz

  static get tableName() {
    return "quiz_answer"
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    itemAnswers: {
      relation: Model.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
    peerReviews: {
      relation: Model.HasManyRelation,
      modelClass: PeerReview,
      join: {
        from: "quiz_answer.id",
        to: "peer_review.quiz_answer_id",
      },
    },
    userQuizState: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserQuizState,
      join: {
        from: ["quiz_answer.user_id", "quiz_answer.quiz_id"],
        to: ["user_quiz_state.user_id", "user_quiz_state.quiz_id"],
      },
    },
    quiz: {
      relation: Model.BelongsToOneRelation,
      modelClass: `${__dirname}/quiz`,
      join: {
        from: "quiz_answer.quiz_id",
        to: "quiz.id",
      },
    },
  }

  public static async getById(quizAnswerId: string) {
    const quizAnswer = await this.query()
      .findById(quizAnswerId)
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")

    quizAnswer.peerReviews.map(peerReview => {
      if (peerReview.answers.length > 0) {
        return peerReview.answers.map(peerReviewAnswer => {
          peerReviewAnswer.question = this.moveQuestionTextsToparent(
            peerReviewAnswer.question,
          )
        })
      }
    })

    return quizAnswer
  }

  public static async getPaginatedByQuizId(
    quizId: string,
    page: number,
    pageSize: number,
    order: "asc" | "desc",
    filters: string[],
  ) {
    let paginated
    if (filters.length === 0) {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    } else {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .whereIn("status", filters)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    }

    paginated.results.map(answer => {
      if (answer.peerReviews.length > 0) {
        answer.peerReviews.map(peerReview => {
          if (peerReview.answers.length > 0) {
            peerReview.answers.map(peerReviewAnswer => {
              peerReviewAnswer.question = this.moveQuestionTextsToparent(
                peerReviewAnswer.question,
              )
            })
          }
        })
      }
    })

    return paginated
  }

  public static async getPaginatedManualReview(
    quizId: string,
    page: number,
    pageSize: number,
    order: "asc" | "desc",
  ) {
    const paginated = await this.query()
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .orderBy([{ column: "created_at", order: order }])
      .page(page, pageSize)
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")

    paginated.results.map(answer => {
      if (answer.peerReviews.length > 0) {
        answer.peerReviews.map(peerReview => {
          if (peerReview.answers.length > 0) {
            peerReview.answers.map(peerReviewAnswer => {
              peerReviewAnswer.question = this.moveQuestionTextsToparent(
                peerReviewAnswer.question,
              )
            })
          }
        })
      }
    })

    return paginated
  }

  public static async setManualReviewStatus(
    answerId: string,
    status: QuizAnswerStatus,
  ) {
    if (!["confirmed", "rejected"].includes(status)) {
      throw new BadRequestError("invalid status")
    }
    const trx = await knex.transaction()
    try {
      let quizAnswer = (
        await this.query(trx)
          .where("quiz_answer.id", answerId)
          .withGraphJoined("userQuizState")
          .withGraphJoined("quiz")
      )[0]
      const userQuizState = quizAnswer.userQuizState
      const quiz = quizAnswer.quiz
      if (status === "confirmed") {
        await userQuizState.$query(trx).patch({ pointsAwarded: quiz.points })
      } else if (!quiz.triesLimited || userQuizState.tries < quiz.tries) {
        await userQuizState
          .$query(trx)
          .patch({ peerReviewsReceived: 0, spamFlags: 0, status: "open" })
      }
      quizAnswer = await quizAnswer.$query(trx).patchAndFetch({ status })
      await UserCoursePartState.update(
        quizAnswer.userId,
        quiz.courseId,
        quiz.part,
        trx,
      )
      await Kafka.broadcastQuizAnswerUpdated(
        quizAnswer,
        userQuizState,
        quiz,
        trx,
      )
      await Kafka.broadcastUserProgressUpdated(
        quizAnswer.userId,
        quiz.courseId,
        trx,
      )
      await trx.commit()
      return quizAnswer
    } catch (error) {
      await trx.rollback()
      throw new BadRequestError(error)
    }
  }

  public static async getManualReviewCountsByCourseId(courseId: string) {
    const counts: any[] = await this.query()
      .select(["quiz_id"])
      .join("quiz", "quiz_answer.quiz_id", "=", "quiz.id")
      .where("course_id", courseId)
      .andWhere("status", "manual-review")
      .count()
      .groupBy("quiz_id")
    const countByQuizId: { [quizId: string]: number } = {}
    for (const count of counts) {
      countByQuizId[count.quizId] = count.count
    }
    return countByQuizId
  }

  public static async getManualReviewCountByQuizId(quizId: string) {
    const count: any[] = await this.query()
      .select(["quiz_id"])
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .count()
      .groupBy("quiz_id")

    if (count.length === 0) {
      return 0
    }

    return count[0].count
  }

  public static async getAnswerCountsByStatus(quizId: string) {
    const counts: any[] = await this.query()
      .select("status")
      .where("quiz_id", quizId)
      .count()
      .groupBy("status")

    const total: any[] = await this.query()
      .where("quiz_id", quizId)
      .count()

    const countByStatus: { [status: string]: number } = {}
    for (const count of counts) {
      countByStatus[count.status] = Number(count.count)
    }
    countByStatus["total"] = Number(total[0].count)

    return countByStatus
  }

  public static async getStates() {
    const states = await this.query()
      .select("status")
      .distinct("status")

    return states.map(state => state.status)
  }

  private static moveQuestionTextsToparent = (question: PeerReviewQuestion) => {
    question.title = question.texts[0].title
    question.body = question.texts[0].body
    return question
  }

  public static async save(
    user: UserInfo,
    quizAnswer: QuizAnswer,
    updateTransaction?: Knex.Transaction,
  ) {
    const trx = updateTransaction || (await knex.transaction())
    const userId = user.id
    const quizId = quizAnswer.quizId
    const isUserInDb = await User.getById(userId, trx)
    if (!isUserInDb) {
      quizAnswer.user = User.fromJson({ id: userId })
    }
    quizAnswer.userId = user.id
    const quiz = await Quiz.getById(quizId, trx)
    const course = await Course.getById(quiz.courseId, trx)
    quizAnswer.languageId = course.languageId
    const userQuizState =
      (await UserQuizState.getByUserAndQuiz(userId, quizId, trx)) ??
      UserQuizState.fromJson({ userId, quizId })
    if (!updateTransaction) {
      this.checkIfSubmittable(quiz, userQuizState)
    }
    await this.assessAnswerStatus(quizAnswer, userQuizState, quiz, course, trx)
    this.assessAnswer(quizAnswer, quiz)
    this.gradeAnswer(quizAnswer, userQuizState, quiz)
    this.assessUserQuizStatus(quizAnswer, userQuizState, quiz)
    let savedQuizAnswer
    let savedUserQuizState
    await this.markPreviousAsDeprecated(userId, quizId, trx)
    savedQuizAnswer = await this.query(trx).upsertGraphAndFetch(quizAnswer)
    savedUserQuizState = await UserQuizState.query(trx).upsertGraphAndFetch(
      userQuizState,
      {
        insertMissing: true,
      },
    )
    try {
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw new BadRequestError(error)
    }
    return {
      quiz,
      quizAnswer: savedQuizAnswer,
      userQuizState: savedUserQuizState,
    }
  }

  private static checkIfSubmittable(quiz: Quiz, userQuizState: UserQuizState) {
    if (userQuizState.status === "locked") {
      throw new BadRequestError("already answered")
    }
    if (quiz.deadline && quiz.deadline < new Date()) {
      throw new BadRequestError("no submission past deadline")
    }
  }

  private static assessAnswer(quizAnswer: QuizAnswer, quiz: Quiz) {
    const quizItemAnswers = quizAnswer.itemAnswers
    const quizItems = quiz.items
    if (!quizItemAnswers || quizItemAnswers.length != quizItems.length) {
      throw new BadRequestError("item answers missing")
    }
    for (const quizItemAnswer of quizItemAnswers) {
      const quizItem = quizItems.find(
        item => item.id === quizItemAnswer.quizItemId,
      )
      if (!quizItem) {
        throw new BadRequestError("invalid quiz item id")
      }

      switch (quizItem.type) {
        case "open":
          const textData = removeNonPrintingCharacters(quizItemAnswer.textData)
            .replace(/\0/g, "")
            .trim()
          if (!textData) {
            throw new BadRequestError("no answer provided")
          }
          const validityRegex = quizItem.validityRegex.trim()
          const validator = new RegExp(validityRegex, "i")
          quizItemAnswer.correct = validator.test(textData) ? true : false
          break
        case "essay":
          if (quizAnswer.status === "confirmed") {
            quizItemAnswer.correct = true
          }
          break
        case "multiple-choice":
          const quizOptionAnswers = quizItemAnswer.optionAnswers
          const quizOptions = quizItem.options
          if (
            !quizOptionAnswers ||
            quizOptionAnswers.length != quizOptions.length
          ) {
            throw new BadRequestError("option answers missing")
          }
          const correctOptionIds = quizOptions
            .filter(quizOption => quizOption.correct === true)
            .map(quizOption => quizOption.id)
          const selectedCorrectOptions = quizOptionAnswers.filter(
            quizOptionAnswer =>
              correctOptionIds.includes(quizOptionAnswer.quizOptionId),
          )
          quizItemAnswer.correct = quizItem.multi
            ? correctOptionIds.length === selectedCorrectOptions.length
            : selectedCorrectOptions.length > 0
          break
        case "custom-frontend-accept-data":
          break
        case "checkbox":
          quizItemAnswer.correct = true
          break
        case "scale":
        case "research-agreement":
        case "feedback":
          quizItemAnswer.correct = true
          break
      }
    }
  }

  private static async assessAnswerStatus(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
    course: Course,
    trx: Knex.Transaction,
  ) {
    const hasPeerReviews = quiz.peerReviews.length > 0
    if (hasPeerReviews) {
      const peerReviews = await quizAnswer.$relatedQuery("peerReviews", trx)
      quizAnswer.status = this.assessAnswerWithPeerReviewsStatus(
        quiz,
        quizAnswer,
        userQuizState,
        peerReviews,
        course,
      )
    } else {
      quizAnswer.status = "confirmed"
    }
  }

  private static gradeAnswer(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    if (quizAnswer.status === "confirmed") {
      if (quiz.awardPointsEvenIfWrong) {
        userQuizState.pointsAwarded = quiz.points
        return
      }
      const quizItemAnswers = quizAnswer.itemAnswers
      const nCorrect = quizItemAnswers.filter(
        itemAnswer => itemAnswer.correct === true,
      ).length
      const total = quizItemAnswers.length
      const points = (nCorrect / total) * quiz.points
      const pointsAwarded = userQuizState.pointsAwarded ?? 0
      userQuizState.pointsAwarded =
        points > pointsAwarded ? points : pointsAwarded
    }
  }

  private static assessUserQuizStatus(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    userQuizState.tries = (userQuizState.tries ?? 0) + 1
    const hasTriesLeft = !quiz.triesLimited || userQuizState.tries < quiz.tries
    const hasPeerReviews = quiz.peerReviews.length > 0
    if (hasTriesLeft) {
      if (hasPeerReviews) {
        if (["rejected", "spam"].includes(quizAnswer.status)) {
          userQuizState.peerReviewsReceived = null
          userQuizState.spamFlags = null
          userQuizState.status = "open"
        } else {
          userQuizState.status = "locked"
        }
        return
      }
      userQuizState.status = "open"
    } else {
      userQuizState.status = "locked"
    }
  }

  public static assessAnswerWithPeerReviewsStatus(
    quiz: Quiz,
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    peerReviews: PeerReview[],
    course: Course,
  ): QuizAnswerStatus {
    const status = quizAnswer.status || "submitted"

    if (["confirmed", "rejected", "spam"].includes(status)) {
      return status
    }

    const autoConfirm = quiz.autoConfirm
    const autoReject = quiz.autoReject

    const maxSpamFlags = course.maxSpamFlags
    const maxReviewSpamFlags = course.maxReviewSpamFlags

    const spamFlagsReceived = userQuizState.spamFlags ?? 0

    const givenEnough =
      userQuizState.peerReviewsGiven >= course.minPeerReviewsGiven
    const givenExtra =
      userQuizState.peerReviewsGiven > course.minPeerReviewsGiven
    const receivedEnough =
      userQuizState.peerReviewsReceived ?? 0 >= course.minPeerReviewsReceived

    const flaggedButKeepInPeerReviewPool =
      spamFlagsReceived >= maxSpamFlags &&
      spamFlagsReceived < maxReviewSpamFlags
    const flaggedAndRemoveFromPeerReviewPool =
      spamFlagsReceived >= maxReviewSpamFlags

    if (autoReject && flaggedAndRemoveFromPeerReviewPool) {
      return "spam"
    }

    if (!autoReject) {
      if (flaggedAndRemoveFromPeerReviewPool) {
        if (givenEnough) {
          return "manual-review"
        } else {
          return "manual-review-once-given-enough"
        }
      }
      if (flaggedButKeepInPeerReviewPool) {
        if (givenEnough) {
          if (receivedEnough) {
            return "manual-review"
          } else if (givenExtra) {
            return "manual-review-once-received-enough-given-more-than-enough"
          } else {
            return "manual-review-once-received-enough"
          }
        } else if (receivedEnough) {
          return "manual-review-once-given-enough"
        } else {
          return "manual-review-once-given-and-received-enough"
        }
      }
    }

    if (!givenEnough && !receivedEnough) {
      return status
    }

    if (!givenEnough && receivedEnough) {
      return "enough-received-but-not-given"
    }

    if (givenEnough && !receivedEnough) {
      if (givenExtra) {
        return "given-more-than-enough"
      } else {
        return "given-enough"
      }
    }

    if (autoConfirm) {
      const answers = peerReviews
        .map(pr => pr.answers.map(a => a.value))
        .flat()
        .filter(o => o !== undefined && o !== null)

      const sum: number = answers.reduce((prev, curr) => prev + curr, 0)

      if (answers.length === 0) {
        console.warn("Assessing an essay with 0 numeric peer review answers")
        return status
      }

      if (sum / answers.length >= quiz.course.minReviewAverage) {
        return "confirmed"
      } else if (autoReject) {
        return "rejected"
      } else {
        return "manual-review"
      }
    }

    // TODO: if not auto confirm move to manual review once widget smart enough
    return status
  }

  private static async markPreviousAsDeprecated(
    userId: number,
    quizId: string,
    trx: Knex.Transaction,
  ) {
    await this.query(trx)
      .update({ status: "deprecated" })
      .where("user_id", userId)
      .andWhere("quiz_id", quizId)
  }
}

export default QuizAnswer
