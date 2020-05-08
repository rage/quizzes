import { DeepPartial } from "typeorm"

import { Quiz, UserQuizState, QuizAnswer, PeerReview } from "../src/models"

interface TestData {
  quiz: DeepPartial<Quiz>
  quizAnswer: DeepPartial<QuizAnswer>
  userQuizState: DeepPartial<UserQuizState>
  passingPeerReviews: DeepPartial<PeerReview>[]
}

const data: TestData = {
  quiz: {
    id: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    courseId: "21356a26-7508-4705-9bab-39b239862632",
    part: 1,
    section: 3,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    createdAt: "2018-05-04 15:00:23.606000",
    updatedAt: "2018-06-25 20:35:55.073000",
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
      createdAt: "2019-03-10 21:19:54.081043",
      updatedAt: "2019-03-10 21:19:54.081043",
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
        createdAt: "2018-05-04 15:00:23.606000",
        updatedAt: "2020-04-23 14:01:31.890549",
        minWords: null,
        maxWords: null,
        maxValue: null,
        minValue: null,
        usesSharedOptionFeedbackMessage: false,
      },
    ],
  },
  quizAnswer: {
    quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    status: "confirmed",
  },
  userQuizState: {
    quizId: "3c954097-268f-44bf-9d2e-1efaf9e8f122",
    peerReviewsGiven: 4,
    peerReviewsReceived: 2,
    pointsAwarded: 1,
    spamFlags: 0,
    tries: 1,
    status: "locked",
  },
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
  ],
}

export default data
