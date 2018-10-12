export const Quiz = `
  type Quiz {
    id: String!,
    course: Course,
    texts(languageId: String): [QuizTranslation],
    section: Int,
    deadline: DateTime,
    open: DateTime,
    items(languageId: String): [QuizItem],
    peerReviewQuestions(languageId: String): [PeerReviewQuestion],
    excludedFromScore: Boolean,
    createdAt: DateTime,
    updatedAt: DateTime
  }
`
