import { createAction } from "typesafe-actions"
import { Entities } from "../../types/NormalizedQuiz"

export const initializedEditor = createAction(
  "INITIALIZED_EDITOR",
  (quiz: Entities) => ({ quiz: quiz }),
)<{ quiz: Entities }>()

export const editedQuizItemBody = createAction(
  "EDITED_QUIZ_ITEM_BODY",
  (newBody: string, itemId: string) => ({ body: newBody, id: itemId }),
)<{ body: string; id: string }>()

export const editedQuizItemTitle = createAction(
  "EDITED_QUIZ_ITEM_TITLE",
  (newTitle: string, itemId: string) => ({ title: newTitle, id: itemId }),
)<{ title: string; id: string }>()

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

export const editedOptionTitle = createAction(
  "EDITED_OPTION_TITLE",
  (newTitle: string, optionId: string) => ({
    newTitle: newTitle,
    optionId: optionId,
  }),
)<{ newTitle: string; optionId: string }>()

export const editedOptionCorrectnes = createAction(
  "EDITED_OPTION_CORRECTNES",
  (itemId: string, optionId: string) => ({
    itemId: itemId,
    optionId: optionId,
  }),
)<{ itemId: string; optionId: string }>()

export const editedScaleMinMaxValue = createAction(
  "EDITED_SCALE_VALUE",
  (itemId: string, newValue: number, max: boolean) => ({
    itemId: itemId,
    newValue: newValue,
    max: max,
  }),
)<{ itemId: string; newValue: number; max: boolean }>()

export const editedScaleMinMaxLabel = createAction(
  "EDITED_SCALE_LABEL",
  (itemId: string, newLabel: string, max: boolean) => ({
    itemId: itemId,
    newLabel: newLabel,
    max: max,
  }),
)<{ itemId: string; newLabel: string; max: boolean }>()

export const editedValidityRegex = createAction(
  "EDITED_VALIDITY_REGEX",
  (itemId: string, newRegex: string) => ({
    itemId: itemId,
    newRegex: newRegex,
  }),
)<{ itemId: string; newRegex: string }>()

export const toggledMultiOptions = createAction(
  "TOGGLED_MULTI_OPTIONS",
  (itemId: string) => ({
    itemId: itemId,
  }),
)<{ itemId: string }>()

export const editedItemMessage = createAction(
  "EDITED_ITEM_MESSAGE",
  (itemId: string, newMessage: string, success: boolean) => ({
    itemId: itemId,
    newMessage: newMessage,
    success: success,
  }),
)<{ itemId: string; newMessage: string; success: boolean }>()
