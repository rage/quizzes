import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import {
  Course,
  Quiz,
  QuizAnswer,
  UserCourseState,
  UserCoursePartState,
  UserQuizState,
} from "../models"
import { IQuizAnswerQuery } from "../types"
import CourseService from "./course.service"
import QuizService from "./quiz.service"
import QuizAnswerService from "./quizanswer.service"
import UserQuizStateService from "./userquizstate.service"
import { isBuffer } from "util"

@Service()
export default class UserCoursePartStateService {
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

  public async getUserCoursePartState(
    userId: number,
    courseId: string,
    partNumber: number,
  ) {
    return await this.entityManager
      .createQueryBuilder(UserCoursePartState, "user_course_part_state")
      .where("user_course_part_state.user_id = :userId", { userId })
      .andWhere("user_course_part_state.course_id = :courseId", { courseId })
      .andWhere("user_course_part_state.course_part = :course_part", {
        course_part: partNumber,
      })
      .getOne()
  }

  public async getUserCoursePartStates(userId: number, courseId: string) {
    return await this.entityManager
      .createQueryBuilder(UserCoursePartState, "user_course_part_state")
      .where("user_course_part_state.user_id = :userId", { userId })
      .andWhere("user_course_part_state.course_id = :courseId", { courseId })
      .getMany()
  }

  public async updateUserCoursePartState(
    manager: EntityManager,
    quiz: Quiz,
    userId: number,
  ): Promise<UserCoursePartState> {
    let userCoursePartState = await this.getUserCoursePartState(
      userId,
      quiz.courseId,
      quiz.part,
    )
    if (!userCoursePartState) {
      return await this.createUserCoursePartState(
        manager,
        userId,
        quiz.courseId,
        quiz.part,
      )
    } else {
      const quizzesInPart = await this.quizService.getQuizzes({
        courseId: quiz.courseId,
        coursePart: quiz.part,
        exclude: true,
      })

      let pointsTotal: number = 0
      const quizIds: string[] = quizzesInPart.map(quiz => {
        pointsTotal += quiz.points
        return quiz.id
      })

      const userQuizStates: UserQuizState[] = await this.userQuizStateService.getQuizStatesForUserCourse(
        manager,
        userId,
        quizIds,
      )

      let pointsAwarded: number = 0

      userQuizStates.forEach(uqs => {
        pointsAwarded += uqs.pointsAwarded
      })

      userCoursePartState.score = (pointsAwarded / pointsTotal) * 100
      userCoursePartState.progress =
        (userQuizStates.length / quizzesInPart.length) * 100

      if (userCoursePartState.score > 99.99) {
        userCoursePartState.completed = true
      }

      return await manager.save(userCoursePartState)
    }
  }

  public async createUserCoursePartState(
    manager: EntityManager,
    userId: number,
    courseId: string,
    coursePart: number,
  ): Promise<UserCoursePartState> {
    const quizzesInPart = await this.quizService.getQuizzes({
      courseId: courseId,
      coursePart: coursePart,
      exclude: true,
    })

    let pointsTotal: number = 0
    const quizIds: string[] = quizzesInPart.map(quiz => {
      pointsTotal += quiz.points
      return quiz.id
    })

    const userQuizStates: UserQuizState[] = await this.userQuizStateService.getQuizStatesForUserCourse(
      manager,
      userId,
      quizIds,
    )

    const userCoursePartState: UserCoursePartState = new UserCoursePartState()

    let pointsAwarded: number = 0
    userQuizStates.forEach(uqs => {
      pointsAwarded += uqs.pointsAwarded
    })

    userCoursePartState.userId = userId
    userCoursePartState.courseId = courseId
    userCoursePartState.coursePart = coursePart
    userCoursePartState.score = (pointsAwarded / pointsTotal) * 100
    userCoursePartState.progress =
      (userQuizStates.length / quizzesInPart.length) * 100

    if (userCoursePartState.score > 99.99) {
      userCoursePartState.completed = true
    }

    return await manager.save(userCoursePartState)
  }
}
