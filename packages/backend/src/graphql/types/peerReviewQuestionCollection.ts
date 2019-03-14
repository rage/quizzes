export const PeerReviewCollection = `
  type PeerReviewCollection {
    id: String!,
    quiz: Quiz!,
    quizId: String,
    tests: [PeerReviewCollectionTranslation],
    questions: [PeerReviewQuestion],
    createdAt: DateTime,
    updatedAt: DateTime
  }
`
