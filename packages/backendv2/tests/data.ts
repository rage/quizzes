import { uuid, dateTime } from "./util"

export const input = {
  newQuiz: {
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    items: [
      {
        type: "multiple-choice",
        order: 1,
        allAnswersCorrect: true,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        options: [
          {
            order: 1,
            correct: false,
            title: "A",
            successMessage: "true",
            failureMessage: "false",
          },
        ],
      },
      {
        type: "essay",
        order: 2,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        allAnswersCorrect: false,
        sharedOptionFeedbackMessage: null,
      },
    ],
    peerReviews: [
      {
        title: "pr",
        body: "do this",
        deleted: false,
        questions: [
          {
            default: true,
            deleted: false,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
          },
        ],
      },
    ],
  },
  quizUpdate: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    items: [
      {
        type: "open",
        order: 1,
        allAnswersCorrect: false,
        usesSharedOptionFeedbackMessage: false,
        validityRegex: "kissa",
        title: "open",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
      },
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        allAnswersCorrect: true,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
      },
    ],
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quiz_id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        deleted: false,
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peer_review_collection_id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            deleted: false,
          },
        ],
      },
    ],
  },
  quizAnswerPastDeadline: {
    quizId: "b03f05d3-ec14-47f4-9352-0be6a53b4a14",
  },
  quizAnswerAlreadyAnswered: {
    quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
  },
  quizAnswerOpen: {
    quizId: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
    itemAnswers: [
      {
        quizItemId: "4a55eb54-6a9c-4245-843c-0577f3eafd9e",
        textData: "koira",
      },
      {
        quizItemId: "8e1fe9a3-f9ca-4bba-acdb-98d5c41060d3",
        textData: "kissa",
      },
    ],
  },
  peerReview1: {
    quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
    rejectedQuizAnswerIds: null,
    answers: [
      {
        peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        value: 5,
      },
    ],
  },
  peerReview2: {
    quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
    peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
    rejectedQuizAnswerIds: null,
    answers: [
      {
        peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        value: 4,
      },
    ],
  },
  peerReview3: {
    quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
    rejectedQuizAnswerIds: null,
    answers: [
      {
        peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        value: 3,
      },
    ],
  },
  peerReview4: {
    quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
    peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
    rejectedQuizAnswerIds: null,
    answers: [
      {
        peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
        value: 3,
      },
    ],
  },
  duplicateCourseValid: {
    oldCourseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    name: "Some Duplicate",
    abbr: "Some Duplicate",
    lang: "xy_YZ",
  },
  correspondenceIds: {
    oldCourseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    newCourseId: "51b66fc3-4da2-48aa-8eab-404370250ca3",
  },
  editedCourse: {
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    moocfiId: "d7a4e8ae-f586-4f2e-9d1f-b9ea0969bf1d",
    title: "edited title",
    abbreviation: "edited abbreviation",
    languageId: "aa_BB",
  },
}

interface QuizValidator {
  id: string
  courseId: string
  part: number
  section: number
  points: number
  deadline: jest.Matchers<string, RegExp>
  open: null
  excludedFromScore: false
  autoConfirm: true
  tries: 1
  triesLimited: true
  awardPointsEvenIfWrong: false
  grantPointsPolicy: "grant_whenever_possible"
  autoReject: true
  title: "quiz"
  body: "body"
  submitMessage: "nice one!"
  createdAt: jest.Matchers<string, RegExp>
  updatedAt: jest.Matchers<string, RegExp>
}

export const validation = {
  newQuiz: {
    id: expect.stringMatching(uuid),
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        type: "multiple-choice",
        order: 1,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        allAnswersCorrect: true,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [
          {
            id: expect.stringMatching(uuid),
            quizItemId: expect.stringMatching(uuid),
            order: 1,
            correct: false,
            title: "A",
            body: "",
            successMessage: "true",
            failureMessage: "false",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        allAnswersCorrect: false,
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ],
    peerReviews: [
      {
        id: expect.stringMatching(uuid),
        quizId: expect.stringMatching(uuid),
        title: "pr",
        body: "do this",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        deleted: false,
        questions: [
          {
            id: expect.stringMatching(uuid),
            peerReviewCollectionId: expect.stringMatching(uuid),
            quizId: null,
            answerRequired: true,
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            deleted: false,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quizUpdate: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        allAnswersCorrect: true,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
      {
        id: expect.stringMatching(uuid),
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "open",
        order: 1,
        validityRegex: "kissa",
        formatRegex: null,
        allAnswersCorrect: false,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "open",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ],
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        deleted: false,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            quizId: null,
            answerRequired: true,
            deleted: false,
            default: true,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quiz1: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz 1",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "multiple-choice",
        order: 1,
        validityRegex: null,
        formatRegex: null,
        allAnswersCorrect: false,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "multiple-choice",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [
          {
            id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
            quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            order: 1,
            correct: false,
            title: "A",
            body: "",
            successMessage: "true",
            failureMessage: "false",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: "707195a3-aafe-4c06-bf23-854e54e084db",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        type: "essay",
        order: 2,
        validityRegex: null,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "essay",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        allAnswersCorrect: false,
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ],
    peerReviews: [
      {
        id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        title: "pr",
        body: "do this",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        deleted: false,
        questions: [
          {
            id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            quizId: null,
            answerRequired: true,
            default: true,
            deleted: false,
            type: "grade",
            order: 1,
            title: "question",
            body: "answer this",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quiz2: {
    id: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 2,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    tries: 1,
    triesLimited: true,
    awardPointsEvenIfWrong: false,
    grantPointsPolicy: "grant_whenever_possible",
    autoReject: true,
    title: "quiz 2",
    body: "body",
    submitMessage: "nice one!",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    items: [
      {
        id: "8e1fe9a3-f9ca-4bba-acdb-98d5c41060d3",
        quizId: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        type: "open",
        order: 2,
        validityRegex: "kissa",
        formatRegex: null,
        allAnswersCorrect: false,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        options: [],
        title: "open",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
      {
        id: "4a55eb54-6a9c-4245-843c-0577f3eafd9e",
        quizId: "2b8f05ac-2a47-436e-8675-35bfe9a5c0ac",
        type: "open",
        order: 1,
        validityRegex: "koira",
        allAnswersCorrect: false,
        formatRegex: null,
        multi: false,
        minWords: null,
        maxWords: null,
        minValue: null,
        maxValue: null,
        usesSharedOptionFeedbackMessage: false,
        title: "open",
        body: "item",
        successMessage: "yay!",
        failureMessage: "boo!",
        sharedOptionFeedbackMessage: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        options: [],
      },
    ],
    peerReviews: [],
  },
  course1: {
    id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: 2.0,
    maxSpamFlags: 1,
    organizationId: null,
    moocfiId: "aa141326-fc86-4c8f-b7d8-b7778fc56f26",
    maxReviewSpamFlags: 3,
    languageId: "xy_YZ",
    title: "course 1",
    body: "course",
    abbreviation: "course",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  course2: {
    id: "51b66fc3-4da2-48aa-8eab-404370250ca3",
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: 2.0,
    maxSpamFlags: 1,
    organizationId: null,
    moocfiId: "12059bbf-4f5b-49ff-85e2-f5bd0797c603",
    maxReviewSpamFlags: 3,
    languageId: "xy_YZ",
    title: "course 2",
    body: "course",
    abbreviation: "course",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  quizAnswerValidator1: {
    id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    userId: 1234,
    status: "given-enough",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    itemAnswers: [
      {
        id: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        textData: null,
        intData: null,
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        optionAnswers: [
          {
            id: "ab6c2932-193c-439c-a5b5-1694bebdc178",
            quizItemAnswerId: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
            quizOptionId: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      {
        id: "31941489-29a1-448d-bc59-418480d007d9",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quizItemId: "707195a3-aafe-4c06-bf23-854e54e084db",
        textData: null,
        intData: null,
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        optionAnswers: [],
      },
    ],
    userQuizState: {
      userId: 1234,
      quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      peerReviewsGiven: null,
      peerReviewsReceived: null,
      pointsAwarded: null,
      spamFlags: null,
      status: "locked",
      tries: 1,
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
    },
    languageId: "xy_YZ",
    peerReviews: [
      {
        id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        userId: 2345,
        rejectedQuizAnswerIds: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        answers: [
          {
            peerReviewId: "2a486ebb-900a-4a78-ada5-be0792610cf0",
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 1,
            text: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
            question: {
              answerRequired: true,
              body: "answer this",
              createdAt: expect.stringMatching(dateTime),
              default: true,
              id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
              order: 1,
              peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
              quizId: null,
              deleted: false,
              texts: [
                {
                  body: "answer this",
                  createdAt: expect.stringMatching(dateTime),
                  languageId: "xy_YZ",
                  peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
                  title: "question",
                  updatedAt: expect.stringMatching(dateTime),
                },
              ],
              title: "question",
              type: "grade",
              updatedAt: expect.stringMatching(dateTime),
            },
          },
        ],
      },
      {
        id: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        userId: 3456,
        rejectedQuizAnswerIds: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        answers: [
          {
            peerReviewId: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            question: {
              answerRequired: true,
              body: "answer this",
              createdAt: expect.stringMatching(dateTime),
              default: true,
              id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
              order: 1,
              peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
              quizId: null,
              deleted: false,
              texts: [
                {
                  body: "answer this",
                  createdAt: expect.stringMatching(dateTime),
                  languageId: "xy_YZ",
                  peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
                  title: "question",
                  updatedAt: expect.stringMatching(dateTime),
                },
              ],
              title: "question",
              type: "grade",
              updatedAt: expect.stringMatching(dateTime),
            },
            value: 2,
            text: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
    ],
  },
  quizAnswerValidator2: {
    id: "ae29c3be-b5b6-4901-8588-5b0e88774748",
    quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    userId: 2345,
    languageId: "xy_YZ",
    status: "given-enough",
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    itemAnswers: [
      {
        id: "7f92ac20-f9f2-44eb-a5ea-5192254c394d",
        quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
        quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        textData: null,
        intData: null,
        optionAnswers: [
          {
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
            id: "942584cd-1cb1-4d2a-a0c4-3b3f19495b75",
            quizItemAnswerId: "7f92ac20-f9f2-44eb-a5ea-5192254c394d",
            quizOptionId: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
          },
        ],
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
      {
        id: "1e39c9ac-b9d9-4156-8c79-6eb9bf9eabb4",
        quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
        quizItemId: "707195a3-aafe-4c06-bf23-854e54e084db",
        textData: null,
        optionAnswers: [],
        intData: null,
        correct: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
    ],
  },
  spamFlagValidator1: {
    id: expect.stringMatching(uuid),
    quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    userId: 2345,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  spamFlagValidator2: {
    id: expect.stringMatching(uuid),
    quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    userId: 3456,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },
  spamFlagValidator3: {
    id: expect.stringMatching(uuid),
    quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
    userId: 4567,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
  },

  userProgressValidator: [
    {
      group: "osa01",
      progress: 0,
      n_points: 0,
      max_points: 1,
    },
  ],
  receivedPeerReviewsValidator: [
    {
      id: "2a486ebb-900a-4a78-ada5-be0792610cf0",
      peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
      createdAt: expect.stringMatching(dateTime),
      answers: [
        {
          peerReviewId: "2a486ebb-900a-4a78-ada5-be0792610cf0",
          peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          value: 1,
          text: null,
        },
      ],
    },
    {
      id: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
      peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
      createdAt: expect.stringMatching(dateTime),
      answers: [
        {
          peerReviewId: "8cf3efb8-f2ca-44ed-8f18-1e4bd49ee805",
          peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
          value: 2,
          text: null,
        },
      ],
    },
  ],
  givenPeerReviewsValidator: [
    {
      peerReview: {
        id: expect.stringMatching(uuid),
        quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
        userId: 1234,
        peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
        rejectedQuizAnswerIds: null,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        answers: [
          {
            peerReviewId: expect.stringMatching(uuid),
            peerReviewQuestionId: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
            value: 4,
            text: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
          },
        ],
      },
      quizAnswer: {
        id: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        userId: 1234,
        languageId: "xy_YZ",
        status: "given-enough",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        itemAnswers: [
          {
            id: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
            quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
            quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
            textData: null,
            intData: null,
            correct: false,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
            optionAnswers: [
              {
                id: "ab6c2932-193c-439c-a5b5-1694bebdc178",
                quizItemAnswerId: "840ad4ff-8402-4c71-a57f-4b12e4b32bce",
                quizOptionId: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
                createdAt: expect.stringMatching(dateTime),
                updatedAt: expect.stringMatching(dateTime),
              },
            ],
          },
          {
            id: "31941489-29a1-448d-bc59-418480d007d9",
            quizAnswerId: "0cb3e4de-fc11-4aac-be45-06312aa4677c",
            quizItemId: "707195a3-aafe-4c06-bf23-854e54e084db",
            textData: null,
            intData: null,
            correct: null,
            createdAt: expect.stringMatching(dateTime),
            updatedAt: expect.stringMatching(dateTime),
            optionAnswers: [],
          },
        ],
      },
      userQuizState: {
        userId: 1234,
        quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
        peerReviewsGiven: 1,
        peerReviewsReceived: null,
        pointsAwarded: null,
        spamFlags: null,
        tries: 1,
        status: "locked",
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
      },
    },
  ],
  singleCourse: {
    id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    moocfiId: "aa141326-fc86-4c8f-b7d8-b7778fc56f26",
    organizationId: null,
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: 2,
    maxSpamFlags: 1,
    maxReviewSpamFlags: 3,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    languageId: "xy_YZ",
    title: "course 1",
    body: "course",
    abbreviation: "course",
  },
  duplicateCourse: {
    success: true,
    newCourseId: expect.stringMatching(uuid),
  },
  allLanguages: [
    {
      id: "xy_YZ",
      name: "language",
      country: "country",
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
    },
    {
      id: "aa_BB",
      name: "language",
      country: "another country",
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
    },
  ],
  editedCourse: {
    id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    moocfiId: "d7a4e8ae-f586-4f2e-9d1f-b9ea0969bf1d",
    organizationId: null,
    minScoreToPass: null,
    minProgressToPass: null,
    minPeerReviewsReceived: 2,
    minPeerReviewsGiven: 3,
    minReviewAverage: 2,
    maxSpamFlags: 1,
    maxReviewSpamFlags: 3,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    languageId: "aa_BB",
    title: "edited title",
    body: "course",
    abbreviation: "edited abbreviation",
  },
  quizForWidget1: {
    quiz: {
      id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
      part: 1,
      section: 1,
      points: 1,
      deadline: null,
      open: null,
      excludedFromScore: false,
      autoConfirm: true,
      autoReject: true,
      triesLimited: true,
      tries: 1,
      grantPointsPolicy: "grant_whenever_possible",
      awardPointsEvenIfWrong: false,
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
      items: [
        {
          id: "707195a3-aafe-4c06-bf23-854e54e084db",
          quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
          type: "essay",
          order: 2,
          validityRegex: null,
          formatRegex: null,
          multi: false,
          minWords: null,
          maxWords: null,
          minValue: null,
          maxValue: null,
          usesSharedOptionFeedbackMessage: false,
          createdAt: expect.stringMatching(dateTime),
          updatedAt: expect.stringMatching(dateTime),
          options: [],
          title: "essay",
          allAnswersCorrect: false,
          body: "item",
          successMessage: "yay!",
          failureMessage: "boo!",
          sharedOptionFeedbackMessage: null,
        },
        {
          id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
          quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
          type: "multiple-choice",
          order: 1,
          validityRegex: null,
          formatRegex: null,
          multi: false,
          minWords: null,
          maxWords: null,
          minValue: null,
          maxValue: null,
          usesSharedOptionFeedbackMessage: false,
          createdAt: expect.stringMatching(dateTime),
          updatedAt: expect.stringMatching(dateTime),
          allAnswersCorrect: false,
          options: [
            {
              id: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
              quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
              order: 1,
              correct: false,
              createdAt: expect.stringMatching(dateTime),
              updatedAt: expect.stringMatching(dateTime),
              title: "A",
              body: "",
              successMessage: "true",
              failureMessage: "false",
            },
          ],
          title: "multiple-choice",
          body: "item",
          successMessage: "yay!",
          failureMessage: "boo!",
          sharedOptionFeedbackMessage: null,
        },
      ],
      peerReviews: [
        {
          id: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
          quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
          createdAt: expect.stringMatching(dateTime),
          updatedAt: expect.stringMatching(dateTime),
          deleted: false,
          questions: [
            {
              id: "730e3083-7a0d-4ea7-9837-61ee93c6692f",
              quizId: null,
              peerReviewCollectionId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
              default: true,
              order: 1,
              type: "grade",
              answerRequired: true,
              createdAt: expect.stringMatching(dateTime),
              updatedAt: expect.stringMatching(dateTime),
              title: "question",
              body: "answer this",
              deleted: false,
            },
          ],
          title: "pr",
          body: "do this",
        },
      ],
      title: "quiz 1",
      body: "body",
      submitMessage: "nice one!",
      course: {
        id: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
        moocfiId: "aa141326-fc86-4c8f-b7d8-b7778fc56f26",
        organizationId: null,
        minScoreToPass: null,
        minProgressToPass: null,
        minPeerReviewsReceived: 2,
        minPeerReviewsGiven: 3,
        minReviewAverage: 2,
        maxSpamFlags: 1,
        maxReviewSpamFlags: 3,
        createdAt: expect.stringMatching(dateTime),
        updatedAt: expect.stringMatching(dateTime),
        languageId: "xy_YZ",
        title: "course 1",
        body: "course",
        abbreviation: "course",
      },
    },
    quizAnswer: {
      id: "ae29c3be-b5b6-4901-8588-5b0e88774748",
      quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      userId: 2345,
      languageId: "xy_YZ",
      status: "given-enough",
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
      itemAnswers: [
        {
          id: "7f92ac20-f9f2-44eb-a5ea-5192254c394d",
          quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
          quizItemId: "aeb6d4f1-a691-45e4-a900-2f7654a004cf",
          textData: null,
          intData: null,
          correct: null,
          createdAt: expect.stringMatching(dateTime),
          updatedAt: expect.stringMatching(dateTime),
          optionAnswers: [
            {
              id: "942584cd-1cb1-4d2a-a0c4-3b3f19495b75",
              quizItemAnswerId: "7f92ac20-f9f2-44eb-a5ea-5192254c394d",
              quizOptionId: "7c802f5b-52f1-468e-a798-3028edc1d3fd",
              createdAt: expect.stringMatching(dateTime),
              updatedAt: expect.stringMatching(dateTime),
            },
          ],
        },
        {
          id: "1e39c9ac-b9d9-4156-8c79-6eb9bf9eabb4",
          quizAnswerId: "ae29c3be-b5b6-4901-8588-5b0e88774748",
          quizItemId: "707195a3-aafe-4c06-bf23-854e54e084db",
          textData: null,
          intData: null,
          correct: null,
          createdAt: expect.stringMatching(dateTime),
          updatedAt: expect.stringMatching(dateTime),
          optionAnswers: [],
        },
      ],
    },
    userQuizState: {
      userId: 2345,
      quizId: "4bf4cf2f-3058-4311-8d16-26d781261af7",
      peerReviewsGiven: null,
      peerReviewsReceived: null,
      pointsAwarded: null,
      spamFlags: null,
      tries: 1,
      status: "locked",
      createdAt: expect.stringMatching(dateTime),
      updatedAt: expect.stringMatching(dateTime),
    },
  },
  quizPreview: {
    id: "4bf4cf2f-3058-4311-8d16-26d781261af7",
    courseId: "46d7ceca-e1ed-508b-91b5-3cc8385fa44b",
    part: 1,
    section: 1,
    points: 1,
    deadline: null,
    open: null,
    excludedFromScore: false,
    autoConfirm: true,
    autoReject: true,
    triesLimited: true,
    tries: 1,
    grantPointsPolicy: "grant_whenever_possible",
    awardPointsEvenIfWrong: false,
    createdAt: expect.stringMatching(dateTime),
    updatedAt: expect.stringMatching(dateTime),
    texts: [{ title: "quiz 1", body: "body" }],
  },
}

export const userAbilities = {
  abilities: {
    teacher: {
      "51b66fc3-4da2-48aa-8eab-404370250ca3": ["view", "edit", "grade"],
    },
    assistant: {
      "51b66fc3-4da2-48aa-8eab-404370250ca3": ["view", "edit", "grade"],
    },
  },
}

export const possibleAnswerStates = [
  "manual-review",
  "rejected",
  "manual-review-once-given-and-received-enough",
  "draft",
  "given-enough",
  "confirmed",
  "given-more-than-enough",
  "deprecated",
  "enough-received-but-not-given",
  "submitted",
  "manual-review-once-given-enough",
  "spam",
  "total",
]
