import { DeepPartial, Connection } from "typeorm"

import {
  Course,
  Quiz,
  QuizItem,
  UserQuizState,
  QuizAnswer,
  PeerReview,
  User,
} from "../src/models"

export interface TestData {
  quiz: Quiz
  quizAnswer: QuizAnswer
  userQuizState: UserQuizState
  passingPeerReviews: PeerReview[]
}

export const data = {
  quiz: {
    id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    courseId: "21356a26-7508-4705-9bab-39b239862632",
    part: 1,
    section: 3,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: false,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: false,
    course: {
      id: "21356a26-7508-4705-9bab-39b239862632",
      minScoreToPass: null,
      minProgressToPass: null,
      minPeerReviewsReceived: 2,
      minPeerReviewsGiven: 3,
      minReviewAverage: 2,
      maxSpamFlags: 1,
      organizationId: null,
      moocfiId: "55dff8af-c06c-4a97-88e6-af7c04d252ca",
      maxReviewSpamFlags: 3,
    },
    items: [
      {
        id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
        type: "essay",
        order: 0,
        validityRegex: "{}",
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        maxValue: null,
        minValue: null,
        usesSharedOptionFeedbackMessage: false,
      },
    ],
  } as Quiz,
  quizAnswer: {
    quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    status: "submitted",
  } as QuizAnswer,
  userQuizState: {
    quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    peerReviewsGiven: 0,
    peerReviewsReceived: 0,
    pointsAwarded: 0,
    spamFlags: 0,
    tries: 1,
    status: "locked",
  } as UserQuizState,
  passingPeerReviews: [
    {
      answers: [
        {
          value: 3,
        },
        {
          value: 2,
        },
        {
          value: 2,
          text: null,
        },
        {
          value: 3,
          text: null,
        },
      ],
    },
    {
      answers: [
        {
          value: 5,
        },
        {
          value: 5,
        },
        {
          value: 4,
        },
        {
          value: 5,
        },
      ],
    },
  ] as PeerReview[],
  failingPeerReviews: [
    {
      answers: [
        {
          value: 2,
        },
        {
          value: 2,
        },
        {
          value: 2,
          text: null,
        },
        {
          value: 2,
          text: null,
        },
      ],
    },
    {
      answers: [
        {
          value: 2,
        },
        {
          value: 2,
        },
        {
          value: 2,
        },
        {
          value: 1,
        },
      ],
    },
  ] as PeerReview[],
}
