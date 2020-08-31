import { initialize } from "objection"
import {
  Course,
  CourseTranslation,
  Quiz,
  QuizTranslation,
  QuizItem,
  QuizItemTranslation,
  QuizOption,
  QuizOptionTranslation,
  QuizAnswer,
  QuizItemAnswer,
  QuizOptionAnswer,
  PeerReviewCollection,
  PeerReviewCollectionTranslation,
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
  User,
  UserQuizState,
} from "../models"

let initialized = false
export const moduleInitializer = async () => {
  if (initialized) {
    return
  }

  await initialize([
    Quiz,
    QuizTranslation,
    QuizItem,
    QuizItemTranslation,
    QuizOption,
    QuizOptionTranslation,
    QuizAnswer,
    QuizItemAnswer,
    QuizOptionAnswer,
    PeerReviewCollection,
    PeerReviewCollectionTranslation,
    PeerReviewQuestion,
    PeerReviewQuestionTranslation,
    User,
    UserQuizState,
    Course,
    CourseTranslation,
  ])
  initialized = true
}

export default moduleInitializer
