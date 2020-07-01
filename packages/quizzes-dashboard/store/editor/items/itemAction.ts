import { createAction } from "typesafe-actions"

export const editedQuizItemBody = createAction(
  "EDITED_QUIZ_ITEM_BODY",
  (newBody: string, itemId: string) => ({ body: newBody, id: itemId }),
)<{ body: string; id: string }>()

export const editedQuizItemTitle = createAction(
  "EDITED_QUIZ_ITEM_TITLE",
  (newTitle: string, itemId: string) => ({ title: newTitle, id: itemId }),
)<{ title: string; id: string }>()

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

export const editedItemSuccessMessage = createAction(
  "EDITED_ITEM_SUCCESS_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()

export const editedItemFailureMessage = createAction(
  "EDITED_ITEM_FAILURE_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()

export const editedItemMaxWords = createAction(
  "EDITED_ITEM_MAX_WORDS",
  (itemId: string, maxWords: number) => ({
    itemId: itemId,
    maxWords: maxWords,
  }),
)<{ itemId: string; maxWords: number }>()

export const editedItemMinWords = createAction(
  "EDITED_ITEM_MIN_WORDS",
  (itemId: string, minWords: number) => ({
    itemId: itemId,
    minWords: minWords,
  }),
)<{ itemId: string; minWords: number }>()

export const editedSharedOptionsFeedbackMessage = createAction(
  "EDITED_SHARED_OPTION_MESSAGE",
  (itemId: string, newMessage: string) => ({
    itemId: itemId,
    newMessage: newMessage,
  }),
)<{ itemId: string; newMessage: string }>()
