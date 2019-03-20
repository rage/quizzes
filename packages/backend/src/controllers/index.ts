import { CourseController } from "./courses"
import { PeerReviewController } from "./peerreviews"
import { QuizAnswerController } from "./quizanswers"
import { QuizController } from "./quizzes"
import { RootController } from "./root"
import { SpamFlagController } from "./spamflags"
import { UserCoursePartStateController } from "./usercoursepartstate"
import { UserCourseStateController } from "./usercoursestate"

export default [
  CourseController,
  PeerReviewController,
  QuizAnswerController,
  QuizController,
  RootController,
  SpamFlagController,
  UserCoursePartStateController,
  UserCourseStateController,
]
