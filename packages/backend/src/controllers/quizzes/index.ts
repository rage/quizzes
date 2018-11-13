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
import { QuizAnswerService } from "services/quizanswer.service"
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
    const query: IQuizQuery = {
      id: null,
      ..._.pick(params, [
        "course",
        "courseId",
        "courseAbbreviation",
        "language",
        "items",
        "options",
        "peerreviews",
      ]),
    }

    return await this.quizService.getQuizzes(query)
  }

  @Get("/:id")
  public async get(
    @Param("id") id: string,
    @QueryParams() params: string[],
  ): Promise<Quiz[]> {
    const query: IQuizQuery = {
      id,
      ..._.pick(params, [
        "course",
        "language",
        "items",
        "options",
        "peerreviews",
      ]),
    }

    const res: Quiz[] = await this.quizService.getQuizzes(query)

    return res
    /*     if (res.length > 0) {
      return res[0]
    }

    throw new NotFoundError(`quiz with id ${id} and given options not found`) */
  }

  @Post("/")
  public async post(@EntityFromBody() quiz: Quiz): Promise<Quiz> {
    //return await this.entityManager.save(quiz)
    return await this.quizService.createQuiz(quiz)
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
