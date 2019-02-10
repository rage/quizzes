import {
  Course,
  PeerReview,
  PeerReviewQuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizItemAnswer,
  UserCourseState,
  UserQuizState,
} from "@quizzes/common/models"
import { IQuizAnswerQuery } from "@quizzes/common/types"
import { Inject, Service } from "typedi"
import { EntityManager, SelectQueryBuilder } from "typeorm"
import { InjectManager } from "typeorm-typedi-extensions"
import CourseService from "./course.service"
import QuizService from "./quiz.service"
import UserQuizStateService from "./userquizstate.service"

@Service()
export default class UserCourseStateService {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private courseService: CourseService

  @Inject()
  private quizService: QuizService

  @Inject()
  private userQuizStateService: UserQuizStateService

  public async getUserCourseState(userId: number, courseId: string) {
    return await this.entityManager
      .createQueryBuilder(UserCourseState, "user_course_state")
      .where("user_course_state.user_id = :userId", { userId })
      .andWhere("user_course_state.course_id = :courseId", { courseId })
      .getOne()
  }

  public async createUserCourseState(
    manager: EntityManager,
    userId: number,
    courseId: string,
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
    console.log(userQuizStates)
    const userCourseState: UserCourseState = new UserCourseState()
    let pointsAwarded: number = 0
    userQuizStates.map(uqs => {
      pointsAwarded += uqs.pointsAwarded
    })
    console.log(pointsTotal)
    console.log(pointsAwarded)
    userCourseState.pointsAwarded = pointsAwarded
    userCourseState.userId = userId
    userCourseState.courseId = courseId
    userCourseState.quizzesConfirmed = userQuizStates.length
    userCourseState.score = (userCourseState.pointsAwarded / pointsTotal) * 100
    userCourseState.progress =
      (userCourseState.quizzesConfirmed / quizzes.length) * 100
    if (
      userCourseState.score >= course[0].minScoreToPass &&
      userCourseState.progress >= course[0].minProgressToPass
    ) {
      userCourseState.completed = true
    }
    return await manager.save(userCourseState)
  }

  public async updateUserCourseState(
    manager: EntityManager,
    quiz: Quiz,
    userQuizState: UserQuizState,
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
        userCourseState.score >= course[0].minScoreToPass &&
        userCourseState.progress >= course[0].minProgressToPass
      ) {
        userCourseState.completed = true
      }
    }
    return await manager.save(userCourseState)
  }
}
