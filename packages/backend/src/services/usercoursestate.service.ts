import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  UserCourseState,
  UserQuizState,
} from "../models"
import CourseService from "./course.service"
import QuizService from "./quiz.service"
import QuizAnswerService from "./quizanswer.service"
import UserCoursePartStateService from "./usercoursepartstate.service"
import UserQuizStateService from "./userquizstate.service"

import { quizzes as knex } from "../config/knex"

import { PointsByGroup, ProgressMessage } from "../types"

import { RequiredAction } from "./kafka.service"

@Service()
export default class UserCourseStateService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private courseService: CourseService

  @Inject()
  private quizService: QuizService

  @Inject()
  private quizAnswerService: QuizAnswerService

  @Inject()
  private userQuizStateService: UserQuizStateService

  @Inject()
  private userCoursePartStateService: UserCoursePartStateService

  private knex = knex

  public async getUserCourseState(
    userId: number,
    courseId: string,
  ): Promise<any> {
    const course = await this.entityManager
      .createQueryBuilder(Course, "course")
      .where("course.moocfi_id = :courseId", { courseId })
      .getOne()

    const raw = await this.knex.raw(`
      select
        part,
        coalesce(section, 0) section,
        count(case when qa.status = 'confirmed' then 1 end) completed,
        count(q.id) total,
        count(case when qa.status = 'submitted' and uqs.peer_reviews_given < 3 then 1 end) give,
        count(case when qa.status = 'submitted' and peer_reviews_received < 2 then 1 end) pending,
        count(case when qa.status in ('rejected', 'spam') then 1 end) rejected
      from quiz_answer qa
      join user_quiz_state uqs
        on qa.user_id = uqs.user_id
        and qa.quiz_id = uqs.quiz_id
      join quiz q on qa.quiz_id = q.id
      where course_id = '${course.id}'
      and qa.user_id = ${userId}
      group by qa.user_id, part, section
      order by qa.user_id
    `)

    const arr: any[] = []

    raw.rows.forEach((item: any) => {
      const requiredActions: RequiredAction[] = []
      if (item.give > 0) {
        requiredActions.push(RequiredAction.GIVE_PEER_REVIEW)
      }
      if (item.pending > 0) {
        requiredActions.push(RequiredAction.PENDING_PEER_REVIEW)
      }
      if (item.rejected > 0) {
        requiredActions.push(RequiredAction.REJECTED)
      }
      arr.push({
        part: item.part,
        section: item.section,
        exercises_total: item.total,
        exercises_completed: item.completed,
        required_actions: requiredActions,
      })
    })

    const progress: PointsByGroup[] = await this.userCoursePartStateService.getProgress(
      this.entityManager,
      userId,
      course.id,
    )

    let nPoints = 0
    let maxPoints = 0

    progress.forEach(part => {
      nPoints += part.n_points
      maxPoints += part.max_points
    })

    return {
      currentUser: {
        user_course_progresses: [
          {
            n_points: nPoints,
            max_points: maxPoints,
            progress,
            exercise_completions_by_section: arr,
          },
        ],
        completions: [],
      },
    }

    /*return await this.entityManager
      .createQueryBuilder(UserCourseState, "user_course_state")
      .where("user_course_state.user_id = :userId", { userId })
      .andWhere("user_course_state.course_id = :courseId", { courseId })
      .getOne()*/
  }

  public async createUserCourseState(
    manager: EntityManager,
    userId: number,
    courseId: string,
    quizAnswer?: QuizAnswer,
  ): Promise<UserCourseState> {
    const course: Course[] = await this.courseService.getCourses({
      id: courseId,
    })
    const quizzes: Quiz[] = await this.quizService.getQuizzes({
      courseId,
      exclude: true,
    })
    let pointsTotal: number = 0
    const quizIds: string[] = quizzes.map(quiz => {
      pointsTotal += quiz.points
      return quiz.id
    })
    const userQuizStates: UserQuizState[] = await this.userQuizStateService.getQuizStatesForUserCourse(
      manager,
      userId,
      quizIds,
    )
    const userCourseState: UserCourseState = new UserCourseState()
    let pointsAwarded: number = 0
    userQuizStates.map(uqs => {
      pointsAwarded += uqs.pointsAwarded
    })
    userCourseState.pointsAwarded = pointsAwarded
    userCourseState.userId = userId
    userCourseState.courseId = courseId
    userCourseState.quizzesConfirmed = userQuizStates.length
    userCourseState.score = (userCourseState.pointsAwarded / pointsTotal) * 100
    userCourseState.progress = (userQuizStates.length / quizzes.length) * 100
    if (
      userCourseState.score >= course[0].minScoreToPass &&
      userCourseState.progress >= course[0].minProgressToPass
    ) {
      const latestConfirmed: QuizAnswer =
        quizAnswer ||
        (await this.quizAnswerService.getAnswer(
          {
            userId,
            quizId: userQuizStates[0].quizId,
            statuses: ["confirmed"],
          },
          manager,
        ))
      userCourseState.completed = true
      userCourseState.completionDate = latestConfirmed.updatedAt
      userCourseState.completionAnswersDate = latestConfirmed.createdAt
    }
    return await manager.save(userCourseState)
  }

  public async updateUserCourseState(
    manager: EntityManager,
    quiz: Quiz,
    userQuizState: UserQuizState,
    quizAnswer: QuizAnswer,
  ) {
    const courseId = quiz.courseId
    let userCourseState: UserCourseState = await this.getUserCourseState(
      userQuizState.userId,
      courseId,
    )
    if (!userCourseState) {
      userCourseState = await this.createUserCourseState(
        manager,
        userQuizState.userId,
        courseId,
      )
    } else {
      const quizzes: Quiz[] = await this.quizService.getQuizzes({
        courseId,
        exclude: true,
      })
      const course: Course[] = await this.courseService.getCourses({
        id: courseId,
      })
      let totalPoints: number = 0
      quizzes.map(q => (totalPoints += q.points))
      userCourseState.pointsAwarded += userQuizState.pointsAwarded
      userCourseState.quizzesConfirmed += 1
      userCourseState.score =
        (userCourseState.pointsAwarded / totalPoints) * 100
      userCourseState.progress =
        (userCourseState.quizzesConfirmed / quizzes.length) * 100
      if (
        !userCourseState.completed &&
        userCourseState.score >= course[0].minScoreToPass &&
        userCourseState.progress >= course[0].minProgressToPass
      ) {
        userCourseState.completed = true
        userCourseState.completionDate = quizAnswer.updatedAt
        userCourseState.completionAnswersDate = quizAnswer.createdAt
      }
    }
    return await manager.save(userCourseState)
  }

  public async getRequiredActions(userId: number, courseId: string) {
    const course: Course[] = await this.courseService.getCourses({
      id: courseId,
    })
    const quizzes: Quiz[] = await this.quizService.getQuizzes({
      courseId,
      items: true,
    })
    const ids: string[] = quizzes.map(quiz => quiz.id)
    const quizAnswers: QuizAnswer[] = await this.entityManager
      .createQueryBuilder(QuizAnswer, "quiz_answer")
      .where("quiz_answer.user_id = :userId", { userId })
      .andWhere("quiz_answer.quiz_id in (:...ids)", { ids })
      .andWhere("status != 'deprecated'")
      .getMany()
    const userQuizStates: UserQuizState[] = await this.entityManager
      .createQueryBuilder(UserQuizState, "user_quiz_state")
      .where("user_quiz_state.user_id = :userId", { userId })
      .andWhere("user_quiz_state.quiz_id in (:...ids)", { ids })
      .getMany()

    const requiredActions = userQuizStates.map(uqs => {
      const quiz = quizzes.find(q => q.id === uqs.quizId)
      const quizAnswer = quizAnswers.find(
        qa => qa.userId === userId && qa.quizId === quiz.id,
      )
      const actionObject = {
        quizId: quiz.id,
        coursePart: quiz.part,
        status: quizAnswer.status,
        messages: [] as string[],
      }
      if (
        actionObject.status === "rejected" ||
        actionObject.status === "spam"
      ) {
        actionObject.messages.push("rejected in peer review")
      } else if (quiz.items[0].type === "essay") {
        if (uqs.peerReviewsGiven < course[0].minPeerReviewsGiven) {
          actionObject.messages.push("give peer reviews")
        }
        if (uqs.peerReviewsReceived < course[0].minPeerReviewsReceived) {
          actionObject.messages.push("waiting for peer reviews")
        }
      }
      return actionObject
    })
    return requiredActions
  }
}
