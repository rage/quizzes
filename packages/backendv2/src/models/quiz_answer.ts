import Knex from "knex"
import { NotFoundError } from "./../util/error"
import QuizItemAnswer from "./quiz_item_answer"
import User from "./user"
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
import SpamFlag from "./spam_flag"
import _, { cond } from "lodash"
import Objection, { raw } from "objection"
import BaseModel from "./base_model"
import QuizOptionAnswer from "./quiz_option_answer"
import softDelete from "objection-soft-delete"
import { mixin } from "objection"
import QuizAnswerStatusModification from "./quiz_answer_status_modification"
import { TStatusModificationOperation } from "./../types/index"
import { relayNewAnswer } from "../services/plagiarism"
import Language from "./language"

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

class QuizAnswer extends mixin(BaseModel, [
  softDelete({ columnName: "deleted" }),
]) {
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
  correctnessCoefficient!: number
  deleted!: boolean

  static SEARCH_RESULT_LIMIT = 100
  static FIRST_PAGE_INDEX = 0

  static get tableName() {
    return "quiz_answer"
  }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "quiz_answer.user_id",
        to: "user.id",
      },
    },
    itemAnswers: {
      relation: BaseModel.HasManyRelation,
      modelClass: QuizItemAnswer,
      join: {
        from: "quiz_answer.id",
        to: "quiz_item_answer.quiz_answer_id",
      },
    },
    peerReviews: {
      relation: BaseModel.HasManyRelation,
      modelClass: PeerReview,
      join: {
        from: "quiz_answer.id",
        to: "peer_review.quiz_answer_id",
      },
    },
    userQuizState: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: UserQuizState,
      join: {
        from: ["quiz_answer.user_id", "quiz_answer.quiz_id"],
        to: ["user_quiz_state.user_id", "user_quiz_state.quiz_id"],
      },
    },
    quiz: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: `${__dirname}/quiz`,
      join: {
        from: "quiz_answer.quiz_id",
        to: "quiz.id",
      },
    },
    spamFlags: {
      relation: BaseModel.HasManyRelation,
      modelClass: SpamFlag,
      join: {
        from: "quiz_answer.id",
        to: "spam_flag.quiz_answer_id",
      },
    },
  }

  private static async showQuestionInPeerReview(peerReviews: PeerReview[]) {
    peerReviews.map(peerReview => {
      const peerReviewHasAnswers = peerReview.answers.length > 0
      if (peerReviewHasAnswers) {
        return peerReview.answers.map(peerReviewAnswer => {
          peerReviewAnswer.question = this.moveQuestionTextsToparent(
            peerReviewAnswer.question,
          )
        })
      }
    })

    return peerReviews
  }

  public static async getByIdWithPeerReviews(quizAnswerId: string) {
    const quizAnswer = await this.query()
      .findById(quizAnswerId)
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
      .withGraphFetched("quiz.[peerReviewCollections]")

    if (!quizAnswer) {
      throw new NotFoundError(`quiz answer not found: ${quizAnswerId}`)
    }

    if (quizAnswer.peerReviews) {
      quizAnswer.peerReviews = await this.showQuestionInPeerReview(
        quizAnswer.peerReviews,
      )
    }

    return quizAnswer
  }

  public static async getById(quizAnswerId: string, trx?: Knex.Transaction) {
    const quizAnswer = await this.query(trx)
      .findById(quizAnswerId)
      .withGraphFetched("itemAnswers.[optionAnswers]")

    if (!quizAnswer) {
      throw new NotFoundError(`quiz answer not found: ${quizAnswerId}`)
    }

    return quizAnswer
  }

  public static async getByUserAndQuiz(userId: number, quizId: string) {
    return (
      await this.query()
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .where("user_id", userId)
        .andWhere("quiz_id", quizId)
        .andWhereNot("status", "deprecated")
    )[0]
  }

  public static async save(quizAnswer: QuizAnswer, trx: Knex.Transaction) {
    const { id, itemAnswers, ...parentData } = quizAnswer
    await this.query(trx)
      .update(parentData)
      .where("id", id)
    for (const itemAnswer of itemAnswers) {
      const { id, optionAnswers, ...itemAnswerData } = itemAnswer
      await QuizItemAnswer.query(trx)
        .update(itemAnswerData)
        .where("id", id)
      if (optionAnswers) {
        for (const optionAnswer of optionAnswers) {
          const { id, ...optionAnswerData } = optionAnswer
          await QuizOptionAnswer.query(trx)
            .update(optionAnswerData)
            .where("id", id)
        }
      }
    }
    return await this.getById(id, trx)
  }

  public static async getPaginatedByQuizId(
    quizId: string,
    page: number,
    pageSize: number,
    order: "asc" | "desc",
    filters: string[],
    deleted: boolean,
    notDeleted: boolean,
  ) {
    let paginated: Objection.Page<QuizAnswer>
    const noFiltersProvided = filters.length === 0
    let deleteConditions: boolean[] = [
      ...(deleted ? [true] : []),
      ...(notDeleted ? [false] : []),
    ]

    if (noFiltersProvided) {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .whereIn("deleted", deleteConditions)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("quiz.[peerReviewCollections]")
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[quizItem, optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    } else {
      paginated = await this.query()
        .where("quiz_id", quizId)
        .whereIn("deleted", deleteConditions)
        .whereIn("status", filters)
        .orderBy([{ column: "created_at", order: order }])
        .page(page, pageSize)
        .withGraphFetched("quiz.[peerReviewCollections]")
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[quizItem, optionAnswers]")
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
    }

    paginated.results.map(async answer => {
      const answerHasPeerReviews = answer.peerReviews.length > 0
      if (answerHasPeerReviews) {
        answer.peerReviews = await this.showQuestionInPeerReview(
          answer.peerReviews,
        )
      }
    })

    return paginated
  }

  public static async getPaginatedByQuizIdAndSearchQuery(
    quizId: string,
    pageSize: number,
    order: "asc" | "desc",
    filters: string[],
    searchQuery?: string,
  ) {
    if (!searchQuery) {
      throw new BadRequestError("No search query provided.")
    }

    let paginated
    const filtersProvided = filters.length > 0

    if (!filtersProvided) {
      paginated = await this.query()
        .where("quiz_answer.quiz_id", quizId)
        .orderBy([{ column: "created_at", order: order }])
        .page(this.FIRST_PAGE_INDEX, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .join(
          raw("quiz_item_answer as qia on quiz_answer.id = qia.quiz_answer_id"),
        )
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
        .where(
          raw(
            `to_tsvector('english', coalesce(text_data, '')) @@ phraseto_tsquery(?)`,
            [searchQuery],
          ),
        )
        .limit(this.SEARCH_RESULT_LIMIT)
    } else {
      paginated = await this.query()
        .where("quiz_answer.quiz_id", quizId)
        .whereIn("status", filters)
        .orderBy([{ column: "created_at", order: order }])
        .page(this.FIRST_PAGE_INDEX, pageSize)
        .withGraphFetched("userQuizState")
        .withGraphFetched("itemAnswers.[optionAnswers]")
        .join(
          raw("quiz_item_answer as qia on quiz_answer.id = qia.quiz_answer_id"),
        )
        .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
        .where(
          raw(
            `to_tsvector('english', coalesce(text_data, '')) @@ phraseto_tsquery(?)`,
            [searchQuery],
          ),
        )
        .limit(this.SEARCH_RESULT_LIMIT)
    }

    paginated.results.map(async answer => {
      const answerHasPeerReviews = answer.peerReviews.length > 0
      if (answerHasPeerReviews) {
        answer.peerReviews = await this.showQuestionInPeerReview(
          answer.peerReviews,
        )
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
      .withGraphFetched("quiz.[peerReviewCollections]")

    paginated.results.map(async answer => {
      if (answer.peerReviews.length > 0) {
        answer.peerReviews = await this.showQuestionInPeerReview(
          answer.peerReviews,
        )
      }
    })

    return paginated
  }

  public static async getPaginatedManualReviewBySearchQuery(
    quizId: string,
    pageSize: number,
    order: "asc" | "desc",
    searchQuery: string,
  ) {
    if (!searchQuery) {
      throw new BadRequestError("No search query provided.")
    }

    const paginated = await this.query()
      .where("quiz_answer.quiz_id", quizId)
      .andWhere("status", "manual-review")
      .orderBy([{ column: "created_at", order: order }])
      .page(this.FIRST_PAGE_INDEX, pageSize)
      .withGraphFetched("userQuizState")
      .withGraphFetched("itemAnswers.[optionAnswers]")
      .join(
        raw("quiz_item_answer as qia on quiz_answer.id = qia.quiz_answer_id"),
      )
      .withGraphFetched("peerReviews.[answers.[question.[texts]]]")
      .where(
        raw(
          `to_tsvector('english', coalesce(text_data, '')) @@ phraseto_tsquery(?)`,
          [searchQuery],
        ),
      )
      .limit(this.SEARCH_RESULT_LIMIT)

    paginated.results.map(async answer => {
      const answerHasPeerReviews = answer.peerReviews.length > 0
      if (answerHasPeerReviews) {
        answer.peerReviews = await this.showQuestionInPeerReview(
          answer.peerReviews,
        )
      }
    })

    return paginated
  }

  public static async setManualReviewStatusForMany(
    answerIds: string[],
    status: QuizAnswerStatus,
  ) {
    if (!status || !["confirmed", "rejected"].includes(status)) {
      throw new BadRequestError("Invalid answer status provided.")
    }

    let promises: Promise<QuizAnswer>[] = []

    answerIds.forEach(answerId => {
      promises.push(this.setManualReviewStatus(answerId, status))
    })

    return Promise.all(promises)
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
      // get quizAnswer by provided id
      let quizAnswer = (
        await this.query(trx)
          .where("quiz_answer.id", answerId)
          .withGraphJoined("userQuizState")
          .withGraphJoined("quiz")
      )[0]
      const userQuizState = quizAnswer.userQuizState
      const quiz = quizAnswer.quiz

      const triesAreNotLimited = !quiz.triesLimited
      const userHasTriesLeft = userQuizState.tries < quiz.tries

      if (status === "confirmed") {
        await userQuizState.$query(trx).patch({ pointsAwarded: quiz.points })
      } else if (triesAreNotLimited || userHasTriesLeft) {
        await userQuizState
          .$query(trx)
          .patch({ peerReviewsReceived: 0, spamFlags: 0, status: "open" })
      }

      quizAnswer = await quizAnswer.$query(trx).patchAndFetch({ status })

      await UserQuizState.upsert(userQuizState, trx)
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
      throw error
    }
  }

  public static async getManualReviewCountsByCourseId(courseId: string) {
    // validate course id
    try {
      await Course.getFlattenedById(courseId)
    } catch (error) {
      throw error
    }

    const counts: any[] = await this.query()
      .select(["quiz_id"])
      .join("quiz", "quiz_answer.quiz_id", "=", "quiz.id")
      .where("course_id", courseId)
      .andWhere("status", "manual-review")
      .count()
      .groupBy("quiz_id")
    const countByQuizId: {
      [quizId: string]: number
    } = {}
    for (const count of counts) {
      countByQuizId[count.quizId] = count.count
    }
    return countByQuizId
  }

  public static async getManualReviewCountByQuizId(quizId: string) {
    return await this.query()
      .where("quiz_id", quizId)
      .andWhere("status", "manual-review")
      .resultSize()
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
    if (question.texts[0]?.title) {
      question.title = question.texts[0].title
    }
    if (question.texts[0]?.body) {
      question.body = question.texts[0].body
    }
    return question
  }

  public static async newAnswer(userId: number, quizAnswer: QuizAnswer) {
    if (quizAnswer.deleted) {
      throw new BadRequestError("A new answer cannot be marked as deleted.")
    }

    const trx = await knex.transaction()
    try {
      const quizId = quizAnswer.quizId
      const isUserInDb = await User.getById(userId, trx)
      if (!isUserInDb) {
        quizAnswer.user = User.fromJson({ id: userId })
      }
      quizAnswer.userId = userId
      const quiz = await Quiz.getById(quizId, trx)
      const course = await Course.getById(quiz.courseId, trx)
      quizAnswer.languageId = course.languageId
      const userQuizState =
        (await UserQuizState.getByUserAndQuiz(userId, quizId, trx)) ??
        UserQuizState.fromJson({ userId, quizId, tries: 0 })
      this.checkIfSubmittable(quiz, userQuizState)
      this.removeIds(quizAnswer)
      await this.assessAnswerStatus(
        quizAnswer,
        userQuizState,
        quiz,
        course,
        trx,
      )
      this.assessAnswer(quizAnswer, quiz)
      this.gradeAnswer(quizAnswer, userQuizState, quiz)
      this.assessUserQuizStatus(quizAnswer, userQuizState, quiz, false)
      let savedQuizAnswer
      let savedUserQuizState
      await this.markPreviousAsDeprecated(userId, quizId, trx)
      savedQuizAnswer = await this.query(trx).insertGraphAndFetch(quizAnswer)
      savedUserQuizState = await UserQuizState.upsert(userQuizState, trx)
      if (savedQuizAnswer.status === "confirmed") {
        await UserCoursePartState.update(
          savedQuizAnswer.userId,
          quiz.courseId,
          quiz.part,
          trx,
        )
        await Kafka.broadcastQuizAnswerUpdated(
          savedQuizAnswer,
          userQuizState,
          quiz,
          trx,
        )
        await Kafka.broadcastUserProgressUpdated(
          savedQuizAnswer.userId,
          quiz.courseId,
          trx,
        )
      }
      await trx.commit()
      quiz.course = course
      if (quiz.checkPlagiarism) {
        await this.relayPlagiarismData(savedQuizAnswer, quiz)
      }
      return {
        quiz,
        quizAnswer: savedQuizAnswer,
        userQuizState: savedUserQuizState,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private static async relayPlagiarismData(quizAnswer: QuizAnswer, quiz: Quiz) {
    const language = await Language.query().findById(quiz.course.languageId)
    for (const quizItem of quiz.items) {
      if (quizItem.type === "essay") {
        const itemAnswer = quizAnswer.itemAnswers.find(
          itemAnswer => itemAnswer.quizItemId === quizItem.id,
        )
        if (itemAnswer) {
          relayNewAnswer({
            quizId: quiz.id,
            quizAnswerId: quizAnswer.id,
            quizItemAnswerId: itemAnswer.id,
            language: language.name.split(" ")[0].toLowerCase(),
            data: itemAnswer.textData,
          })
        }
      }
    }
  }

  public static async update(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
    trx: Knex.Transaction,
  ) {
    const course = await Course.getById(quiz.courseId, trx)
    await this.assessAnswerStatus(quizAnswer, userQuizState, quiz, course, trx)
    this.assessAnswer(quizAnswer, quiz)
    this.gradeAnswer(quizAnswer, userQuizState, quiz)
    this.assessUserQuizStatus(quizAnswer, userQuizState, quiz, true)
    if (quizAnswer.status === "confirmed") {
      await UserQuizState.upsert(userQuizState, trx)
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

  private static async assessAnswer(quizAnswer: QuizAnswer, quiz: Quiz) {
    const quizItemAnswers = quizAnswer.itemAnswers
    const quizItems = quiz.items
    if (!quizItemAnswers || quizItemAnswers.length === 0) {
      throw new BadRequestError("item answers missing")
    }
    for (const quizItemAnswer of quizItemAnswers) {
      const quizItem = quizItems.find(
        item => item.id === quizItemAnswer.quizItemId,
      )
      if (!quizItem) {
        // If the quiz item has been deleted
        quizItemAnswer.correct = false
        continue
      }

      if (quizItem.allAnswersCorrect) {
        quizItemAnswer.correct = true
        continue
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
        case "multiple-choice-dropdown":
        case "clickable-multiple-choice":
        case "multiple-choice":
          const quizOptionAnswers = quizItemAnswer.optionAnswers
          const quizOptions = quizItem.options
          if (!quizOptionAnswers || quizOptionAnswers.length === 0) {
            throw new BadRequestError("option answers missing")
          }
          const correctOptionIds = quizOptions
            .filter(quizOption => quizOption.correct === true)
            .map(quizOption => quizOption.id)
          const selectedCorrectOptions = quizOptionAnswers.filter(
            quizOptionAnswer =>
              correctOptionIds.includes(quizOptionAnswer.quizOptionId),
          )
          const allSelectedOptionsAreCorrect = quizOptionAnswers.every(
            quizOptionAnswer =>
              correctOptionIds.includes(quizOptionAnswer.quizOptionId),
          )
          quizItemAnswer.correct = quizItem.multi
            ? correctOptionIds.length === selectedCorrectOptions.length &&
              allSelectedOptionsAreCorrect
            : selectedCorrectOptions.length > 0 &&
              quizOptionAnswers.length === 1
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

  public static async logAnswerStatusChange(
    oldAnswerStatus: QuizAnswerStatus,
    newAnswerStatus: QuizAnswerStatus,
    quizAnswerId: string,
    trx: Knex.Transaction,
  ) {
    const statusHasChanged = newAnswerStatus !== oldAnswerStatus

    const mapStatusToOperation: {
      [key: string]: TStatusModificationOperation
    } = {
      spam: "peer-review-spam",
      rejected: "peer-review-reject",
      confirmed: "peer-review-accept",
    }

    if (statusHasChanged) {
      let operation: TStatusModificationOperation | undefined =
        mapStatusToOperation[newAnswerStatus]

      if (operation) {
        await QuizAnswerStatusModification.logStatusChange(
          quizAnswerId,
          operation,
          trx,
        )
      }
    }
  }

  public static async assessAnswerStatus(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
    course: Course,
    trx: Knex.Transaction,
  ) {
    const hasPeerReviews = quiz.peerReviewCollections.length > 0
    if (hasPeerReviews) {
      if (quizAnswer.id) {
        const peerReviews = await PeerReview.query(trx)
          .where("quiz_answer_id", quizAnswer.id)
          .withGraphJoined("answers")

        const quizAnswerStatusAfterAssessment = this.assessAnswerWithPeerReviewsStatus(
          quiz,
          quizAnswer,
          userQuizState,
          peerReviews,
          course,
        )

        await this.logAnswerStatusChange(
          quizAnswer.status,
          quizAnswerStatusAfterAssessment,
          quizAnswer.id,
          trx,
        )

        quizAnswer.status = quizAnswerStatusAfterAssessment
      } else {
        quizAnswer.status = "submitted"
      }
    } else {
      quizAnswer.status = "confirmed"
    }
  }

  private static gradeAnswer(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
  ) {
    if (quizAnswer.status !== "confirmed") {
      return
    }
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

  private static assessUserQuizStatus(
    quizAnswer: QuizAnswer,
    userQuizState: UserQuizState,
    quiz: Quiz,
    update: boolean,
  ) {
    if (!update) {
      userQuizState.tries += 1
    }
    const hasTriesLeft = !quiz.triesLimited || userQuizState.tries < quiz.tries
    const hasPeerReviews = quiz.peerReviewCollections.length > 0
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
    const receivedEnough = userQuizState.peerReviewsReceived
      ? userQuizState.peerReviewsReceived >= course.minPeerReviewsReceived
      : false

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

    const answers = peerReviews
      .map(pr => pr.answers.map(a => a.value))
      .flat()
      .filter(o => o !== undefined && o !== null)

    const sum: number = answers.reduce((prev, curr) => prev + curr, 0)

    if (answers.length === 0) {
      console.warn("Assessing an essay with 0 numeric peer review answers")
      return status
    }

    const passingGrade = sum / answers.length >= course.minReviewAverage

    if (passingGrade) {
      return autoConfirm ? "confirmed" : "manual-review"
    } else {
      return autoReject ? "rejected" : "manual-review"
    }
  }

  public static async getAnswersToReview(reviewerId: number, quizId: string) {
    // validate quiz id
    try {
      await Quiz.getById(quizId)
    } catch (error) {
      throw error
    }

    const answerIds = this.query()
      .select("id")
      .where("quiz_id", quizId)

    const givenPeerReviews = await PeerReview.query()
      .whereIn("quiz_answer_id", answerIds)
      .andWhere("user_id", reviewerId)

    const givenSpamFlags = await SpamFlag.query().where("user_id", reviewerId)

    givenPeerReviews.map(pr => pr.rejectedQuizAnswerIds)

    const rejected: string[] = givenPeerReviews
      .map(pr => pr.rejectedQuizAnswerIds)
      .flat()

    const flagged = givenSpamFlags.map(spamFlag => spamFlag.quizAnswerId)

    const alreadyReviewed = givenPeerReviews.map(pr => pr.quizAnswerId)

    // query will fail if this array is empty
    rejected.push("d28359ed-fe18-4f79-b1a1-b33ee157d004")
    flagged.push("d28359ed-fe18-4f79-b1a1-b33ee157d004")
    alreadyReviewed.push("d28359ed-fe18-4f79-b1a1-b33ee157d004")

    let allCandidates: any[] = []
    let candidates
    let priority = 0

    while (allCandidates.length < 2) {
      candidates = await this.getCandidates(
        priority,
        quizId,
        reviewerId,
        rejected,
        flagged,
        alreadyReviewed,
      )

      if (candidates === null) {
        break
      }

      candidates = _.shuffle(candidates)

      allCandidates = allCandidates.concat(candidates)
      priority++
    }

    if (allCandidates.length < 1) {
      return []
    }

    allCandidates = allCandidates.sort((a, b): number => {
      if (a.status < b.status) {
        return 1
      } else if (a.status > b.status) {
        return -1
      } else {
        return 0
      }
    })

    allCandidates = allCandidates.slice(0, 2)

    return await this.query()
      .withGraphJoined("itemAnswers.[optionAnswers]")
      .whereIn(
        "quiz_answer.id",
        allCandidates.map(c => c.id),
      )
  }

  public static async deleteAnswer(answerId: string): Promise<QuizAnswer> {
    const trx = await knex.transaction()

    try {
      const quizAnswer = await this.query(trx).findById(answerId)

      await this.query(trx)
        .delete()
        .where("id", answerId)

      const quizAnswers = await QuizAnswer.query(trx)
        .where("user_id", quizAnswer.userId)
        .andWhere("quiz_id", quizAnswer.quizId)
        .andWhere("deleted", false)

      const nextBestQuizAnswer =
        quizAnswers.length > 0
          ? quizAnswers.sort(
              (a, b) => b.correctnessCoefficient - a.correctnessCoefficient,
            )[0]
          : undefined

      const maxPoints = (await Quiz.query(trx).findById(quizAnswer.quizId))
        .points

      const userQuizState = (
        await UserQuizState.query(trx)
          .where("user_id", quizAnswer.userId)
          .andWhere("quiz_id", quizAnswer.quizId)
      )[0]

      const newTries = userQuizState.tries > 0 ? userQuizState.tries - 1 : 0

      const updatedUserQuizState = await userQuizState
        .$query(trx)
        .updateAndFetch({
          status:
            newTries >=
            (await Quiz.query(trx).findById(quizAnswer.quizId)).tries
              ? "locked"
              : "open",
          tries: newTries,
          spamFlags: nextBestQuizAnswer
            ? (
                await SpamFlag.query(trx).where(
                  "quiz_answer_id",
                  nextBestQuizAnswer.id,
                )
              ).length
            : 0,
          pointsAwarded: nextBestQuizAnswer
            ? maxPoints * nextBestQuizAnswer.correctnessCoefficient
            : 0,
        })

      nextBestQuizAnswer
        ? await Kafka.broadcastQuizAnswerUpdated(
            nextBestQuizAnswer,
            updatedUserQuizState,
            await Quiz.query(trx).findById(quizAnswer.quizId),
            trx,
          )
        : await Kafka.broadcastQuizAnswerUpdated(
            quizAnswer,
            updatedUserQuizState,
            await Quiz.query(trx).findById(quizAnswer.quizId),
            trx,
          )

      await Kafka.broadcastUserProgressUpdated(
        quizAnswer.userId,
        (await Quiz.query(trx).findById(quizAnswer.quizId)).courseId,
        trx,
      )

      await trx.commit()
      return await this.query().findById(answerId)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private static async getCandidates(
    priority: number,
    quizId: string,
    reviewerId: number,
    rejected: string[],
    flagged: string[],
    alreadyReviewed: string[],
  ): Promise<Array<{ id: string; status: string }> | null> {
    const builder = knex

    let query: Knex.QueryBuilder | null = builder("quiz_answer")
      .select("quiz_answer.id", "quiz_answer.status")
      .where("quiz_answer.quiz_id", quizId)
      .andWhere("quiz_answer.user_id", "!=", reviewerId)
      .andWhere("quiz_answer.id", "NOT IN", alreadyReviewed)
      .andWhere("quiz_answer.id", "NOT IN", flagged)

    query = this.addCriteriaBasedOnPriority(priority, query, rejected)

    if (query === null) {
      return null
    }

    query = query.limit(20)

    return await query
  }

  private static statusesByPriority: (
    | QuizAnswerStatus
    | QuizAnswerStatus[]
  )[] = [
    [
      "given-more-than-enough",
      "manual-review-once-received-enough-given-more-than-enough",
    ],
    ["given-enough", "manual-review-once-received-enough"],
    ["submitted"],
    ["manual-review-once-given-enough"],
    ["manual-review-once-given-and-received-enough"],
    ["manual-review"],
    ["confirmed"],
    ["enough-received-but-not-given"],
  ]

  private static addCriteriaBasedOnPriority(
    priority: number,
    queryBuilder: Knex.QueryBuilder,
    rejected: string[],
  ) {
    // we won't consider rejected answers
    if (priority < this.statusesByPriority.length) {
      queryBuilder = queryBuilder
        .andWhere("quiz_answer.id", "NOT IN", rejected)
        .andWhere("quiz_answer.status", "IN", this.statusesByPriority[priority])
        .orderBy("quiz_answer.created_at", "asc")
    }
    // let's check the few rejected answers, too
    else if (priority === this.statusesByPriority.length) {
      queryBuilder = queryBuilder
        .andWhere("quiz_answer.id", "IN", rejected)
        .andWhere("quiz_answer.status", "IN", this.statusesByPriority.flat())
    } else {
      return null
    }

    return queryBuilder
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

  private static removeIds(quizAnswer: QuizAnswer) {
    delete quizAnswer.id
    quizAnswer.itemAnswers?.forEach(itemAnswer => {
      delete itemAnswer.id
      itemAnswer.optionAnswers?.forEach(optionAnswer => delete optionAnswer.id)
    })
  }
}

export default QuizAnswer
