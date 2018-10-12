export const PeerReviewQuestion = `
  type PeerReviewQuestion {
    id: String!,
    quiz: Quiz!,
    quizId: String!,
    collection: PeerReviewQuestionCollection,
    collectionId: String,
    texts: [PeerReviewQuestionTranslation],
    public: Boolean,
    type: String,
    answerRequired: Boolean,
    order: Int,
    createdAt: DateTime,
    updatedAt: DateTime
  }
`

/*
  type: PeerReviewQuestionType
*/
