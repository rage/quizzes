export const QuizOption = `
  type QuizOption {
    id: String,
    quizItem: QuizItem,
    quizItemId: String,
    order: Int,
    texts: [QuizOptionTranslation],
    correct: Boolean,
    createdAt: DateTime,
    updatedAt: DateTime
  }
`
