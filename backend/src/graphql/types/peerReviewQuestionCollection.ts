export const PeerReviewQuestionCollection = `
  type PeerReviewQuestionCollection {
    id: String,
    quiz: Quiz,
    quizId: String,
    tests: [PeerReviewQuestionCollectionTranslation],
    questions: [PeerReviewQuestion],
    createdAt: DateTime,
    updatedAt: DateTime
  }
`
