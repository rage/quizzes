import { createAction } from "typesafe-actions"

export const editedQuizTitle = createAction(
  "EDITED_QUIZ_TITLE",
  (newTitle: string, quizId: string) => ({ title: newTitle, id: quizId }),
)<{ title: string; id: string }>()

export const editedQuizzesNumberOfTries = createAction(
  "EDITED_QUIZZES_NUMBER_OF_TRIES",
  (numberOfTries: number, quizId: string) => ({
    numberOfTries: numberOfTries,
    id: quizId,
  }),
)<{ numberOfTries: number; id: string }>()

export const editedQuizzesPointsToGain = createAction(
  "EDITED_QUIZZES_POINTS_TO_GAIN",
  (pointsToGain: number, quizId: string) => ({
    pointsToGain: pointsToGain,
    id: quizId,
  }),
)<{ pointsToGain: number; id: string }>()

export const editedQuizzesPointsGrantingPolicy = createAction(
  "EDITED_QUIZZES_POINTS_GRANTING_POLICY",
  (policy: string, quizId: string) => ({ policy: policy, id: quizId }),
)<{ policy: string; id: string }>()

export const editedQuizzesDeadline = createAction(
  "EDITED_QUIZZES_DEADLINE",
  (deadline: string | undefined, quizId: string) => ({
    deadline: deadline,
    id: quizId,
  }),
)<{ deadline: string | undefined; id: string }>()

export const editedQuizzesBody = createAction(
  "EDITED_QUIZZES_BODY",
  (quizId: string, newBody: string) => ({
    quizId: quizId,
    newBody: newBody,
  }),
)<{ quizId: string; newBody: string }>()

export const editedQuizzesSubmitmessage = createAction(
  "EDITED_QUIZZES_SUBMITMESSAGE",
  (quizId: string, newMessage: string) => ({
    quizId: quizId,
    newMessage: newMessage,
  }),
)<{ quizId: string; newMessage: string }>()
