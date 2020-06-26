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
  (optionId: string) => ({
    optionId: optionId,
  }),
)<{ optionId: string }>()
