import { Organization, Quiz, QuizItem } from "@quizzes/common/models"
import TMCApi from "@quizzes/common/services/TMCApi"
import { ITMCProfile, ITMCProfileDetails } from "@quizzes/common/types"
import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { getRepository } from "typeorm"

import { CourseController } from "./courses"
import { PeerReviewController } from "./peerreviews"
import { QuizAnswerController } from "./quizanswers"
import { QuizController } from "./quizzes"
import { RootController } from "./root"
import { SpamFlagController } from "./spamflags"
import { UserCourseStateController } from "./usercoursestate"

export default [
  CourseController,
  PeerReviewController,
  QuizAnswerController,
  QuizController,
  RootController,
  SpamFlagController,
  UserCourseStateController,
]
