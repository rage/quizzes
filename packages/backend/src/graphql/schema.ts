import { makeExecutableSchema } from "graphql-tools"
import { resolvers } from "./resolvers"
import { types } from "./types"
import { GraphQLSchema } from "graphql"
import { Query } from "./types/query"

const scalarTypes = `
  scalar DateTime
`

const schemaDefinition = `
    schema {
        query: Query
      }
`
/*
enum QuizType {
  open,
  scale,
  essay,
  radio,
  checkbox,
  research-agreement
}

enum PeerReviewQuestionType {
  essay,
  grade
}
*/
const typeDefs = [schemaDefinition, scalarTypes, Query, ...types]

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
