import { createAction } from "typesafe-actions"

export const editedOptionTitle = createAction(
  "EDITED_OPTION_TITLE",
  (newTitle: string, optionId: string) => ({
    newTitle: newTitle,
    optionId: optionId,
  }),
)<{ newTitle: string; optionId: string }>()

export const editedOptionCorrectnes = createAction(
  "EDITED_OPTION_CORRECTNES",
  (optionId: string, correct: boolean) => ({
    optionId: optionId,
    correct: correct,
  }),
)<{ optionId: string; correct: boolean }>()

export const editedOptionSuccessMessage = createAction(
  "EDITED_OPTION_SUCCESS_MESSAGE",
  (optionId: string, newMessage: string) => ({
    optionId: optionId,
    newMessage: newMessage,
  }),
)<{ optionId: string; newMessage: string }>()

export const editedOptionFailureMessage = createAction(
  "EDITED_OPTION_FAILURE_MESSAGE",
  (optionId: string, newMessage: string) => ({
    optionId: optionId,
    newMessage: newMessage,
  }),
)<{ optionId: string; newMessage: string }>()

export const deletedOptionFromOptions = createAction(
  "DELETED_OPTION",
  (optionId: string) => ({ optionId: optionId }),
)<{ optionId: string }>()
