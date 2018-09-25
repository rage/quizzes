import GraphQLDateTime from "graphql-iso-date"
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
    ...quizResolver,
    ...quizItemResolver,
    ...quizItemTranslationResolver,
    ...courseResolver,
    ...organizationResolver,
    ...languageResolver,
  },
  Quiz: quizFieldResolver,
  DateTime: {
    ...scalarResolvers,
  },
}
