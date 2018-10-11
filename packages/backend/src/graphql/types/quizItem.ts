export const QuizItem = `
  type QuizItem {
    id: String,
    quiz: Quiz,
    quizId: String,
    type: String
    texts: [QuizItemTranslation],
    options: [QuizOption],
    validityRegex: String,
    formatRegex: String,
    createdAt: DateTime,
    updatedAt: DateTime
  }
`

// type: QuizType
