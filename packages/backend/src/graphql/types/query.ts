export const Query = `
  type Query {
    course(id: String!): Course,
    courses: [Course],
    organization(id: Int!): Organization,
    quiz(id: String!): Quiz,
    quizzes(languageId: String): [Quiz],
    quizItem(id: String!): QuizItem,
    quizItems: [QuizItem],
    quizItemTranslation(quizItemId: String!, languageId: String!): QuizItemTranslation,
    quizItemTranslations(quizItemId: String!): [QuizItemTranslation],
    language(id: String!): Language,
  }
`
