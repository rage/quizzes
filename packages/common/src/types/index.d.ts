import {
  Quiz,
  QuizItem,
  QuizOption,
  QuizTranslation,
  QuizItemTranslation,
  QuizOptionTranslation,
  PeerReviewQuestion,
  PeerReviewQuestionTranslation,
} from "../models"

export class ITMCProfile {
  username: string
  accessToken: string
}

export interface ITMCProfileDetails {
  id: number
  username: string
  email: string
  administrator: boolean
  error?: string
  user_field?: {
    first_name: string
    last_name: string
    organizational_id: string
    course_announcements: boolean
  }
  extra_fields?: {
    language: string
    open_university: string
    helsinki_university: string
    research: string
    marketing: string
    deadline: string
  }
}

export interface ITMCLoginCredentials {
  username: string
  password: string
}

export interface IQuizQuery {
  id?: string
  course?: boolean
  language?: string
  items?: boolean
  options?: boolean
  peerreviews?: boolean
}

export interface IQuizAnswerQuery {
  id?: string
  quiz_id?: string
  user_id?: number
}

export interface INewQuizQuery {
  courseId?: string
  texts: INewQuizTranslation[]
  part?: number
  section?: number
  deadline?: Date
  open?: Date
  items: INewQuizItem[]
  peerReviewQuestions: INewPeerReviewQuestion[]
  excludedFromScore?: boolean
}

export interface INewQuizTranslation {
  quiz?: Quiz
  quizId?: string
  languageId: string
  title: string
  body: string
  submitMessage?: string
}

export interface INewQuizItem {
  quiz?: Quiz
  quizId?: string
  type: string
  order: number
  texts: INewQuizItemTranslation[]
  options: INewQuizOption[]
  validityRegex?: string
  formatRegex?: string
}

export interface INewQuizItemTranslation {
  quizItem?: QuizItem
  quizItemId?: string
  languageId: string
  title?: string
  body?: string
  successMessage?: string
  failureMessage?: string
}

export interface INewQuizOption {
  quizItem?: QuizItem
  quizItemId?: string
  order: number
  texts: INewQuizOptionTranslation[]
  correct: boolean
}

export interface INewQuizOptionTranslation {
  quizOption?: QuizOption
  quizOptionId?: string
  languageId: string
  title: string
  body?: string
  successMessage?: string
  failureMessage?: string
}

export interface INewPeerReviewQuestion {
  quiz?: Quiz
  quizId?: string
  collectionId: string
  texts: INewPeerReviewQuestionTranslation[]
  default: boolean
  type: string
  answerRequired: boolean
  order: number
}

export interface INewPeerReviewQuestionTranslation {
  peerReviewQuestion?: PeerReviewQuestion
  peerReviewQuestionId?: string
  languageId: string
  title: string
  body: string
}
