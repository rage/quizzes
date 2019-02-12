import {
  Organization,
  Quiz,
  QuizItem,
  QuizItemTranslation,
  QuizTranslation,
  QuizOptionTranslation,
  QuizOption,
} from "@quizzes/common/models"
import {
  INewQuizQuery,
  IQuizAnswerQuery,
  IQuizQuery,
} from "@quizzes/common/types"
import { randomUUID } from "@quizzes/common/util"
import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import {
  BadRequestError,
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  QueryParam,
  QueryParams,
} from "routing-controllers"
import QuizService from "services/quiz.service"
import QuizAnswerService from "services/quizanswer.service"
import { Inject } from "typedi"
import { EntityManager } from "typeorm"
import { EntityFromBody } from "typeorm-routing-controllers-extensions"
import { InjectManager } from "typeorm-typedi-extensions"

import _ from "lodash"

@JsonController("/quizzes")
export class QuizController {
  @InjectManager()
  private entityManager: EntityManager

  @Inject()
  private quizService: QuizService
  @Inject()
  private quizAnswerService: QuizAnswerService

  @Get("/")
  public async getAll(@QueryParams() params: string[]): Promise<Quiz[]> {
    return await this.getQuizzes(null, params)
  }

  @Get("/:id")
  public async get(
    @Param("id") id: string,
    @QueryParams() params: any,
  ): Promise<Quiz[]> {
    console.log("params", params)
    return await this.getQuizzes(id, params)
  }

  @Post("/")
  public async post(@EntityFromBody() quiz: Quiz): Promise<Quiz> {
    console.log(quiz)
    // return await this.entityManager.save(quiz)
    return await this.quizService.createQuiz(quiz)
  }

  private async getQuizzes(id: string | null, params: any): Promise<Quiz[]> {
    const query: IQuizQuery = {
      id,
      ..._.pick(params, ["courseId", "courseAbbreviation", "language"]),
      items:
        params.items === "true"
          ? true
          : params.items === "false"
          ? false
          : false,
      course:
        params.course === "true"
          ? true
          : params.course === "false"
          ? false
          : false,
      options:
        params.options === "true"
          ? true
          : params.options === "false"
          ? false
          : false,
      peerreviews:
        params.peerreviews === "true"
          ? true
          : params.peerreviews === "false"
          ? false
          : false,
      stripped:
        params.stripped === "true"
          ? true
          : params.stripped === "false"
          ? false
          : false,
    }

    return await this.quizService.getQuizzes(query)
  }

  /*   @Post("/")
  public async post(@Body({ required: true }) quiz: Quiz): Promise<Quiz> {
    console.log("got", quiz)

    const newQuiz: Quiz = await this.quizService.createQuiz(quiz)

    if (!newQuiz) {
      throw new BadRequestError("couldn't create quiz")
    }

    return newQuiz
  } */
}
