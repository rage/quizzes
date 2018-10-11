import GraphQLDateTime from "graphql-iso-date"
import { IResolverObject } from "graphql-tools"
import { courseResolver } from "./resolvers/course"
import { languageResolver } from "./resolvers/language"
import { organizationResolver } from "./resolvers/organization"
import { quizFieldResolver, quizResolver } from "./resolvers/quiz"
import { quizItemResolver } from "./resolvers/quizItem"
import { quizItemTranslationResolver } from "./resolvers/quizItemTranslation"

import { getRepository } from "typeorm"
import { Quiz } from "../models/quiz"
import { QuizTranslation } from "../models/quiz"
import { QuizItemTranslation } from "../models/quiz_item"

const scalarResolvers = {
  DateTime: GraphQLDateTime,
}

export const resolvers = {
  Query: {
    ...(quizResolver as IResolverObject),
    ...(quizItemResolver as IResolverObject),
    ...(quizItemTranslationResolver as IResolverObject),
    ...(courseResolver as IResolverObject),
    ...(organizationResolver as IResolverObject),
    ...(languageResolver as IResolverObject),
  },
  Quiz: quizFieldResolver as IResolverObject,
  DateTime: {
    ...(scalarResolvers as IResolverObject),
  },
}
