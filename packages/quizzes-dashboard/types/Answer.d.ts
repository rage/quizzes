export interface Answer {
  id: string
  quizId: string
  userId: number
  status: string
  createdAt: string
  updatedAt: string
  userQuizState: UserQuizState
  itemAnswers: ItemAnswer[]
  peerReviews: PeerReview[]
}

export interface ItemAnswer {
  id: string
  quizAnswerId: string
  quizItemId: string
  textData: string
  intData: number | null
  correct: boolean
  createdAt: string
  updatedAt: string
  optionAnswers: any[]
}

export interface PeerReview {
  id: string
  quizAnswerId: string
  userId: number
  peerReviewCollectionId: string
  rejectedQuizAnswerIds: string[]
  createdAt: string
  updatedAt: string
  answers: AnswerElement[]
}

export interface AnswerElement {
  peerReviewId: string
  peerReviewQuestionId: string
  value: number
  text: null
  createdAt: string
  updatedAt: string
}

export interface UserQuizState {
  userId: number
  quizId: string
  peerReviewsGiven: number
  peerReviewsReceived: number
  pointsAwarded: number
  spamFlags: number
  tries: number
  status: string
  createdAt: string
  updatedAt: string
}
