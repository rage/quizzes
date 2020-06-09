import { action, createAction } from "typesafe-actions"
import { EditableQuiz } from "../../types/EditQuiz"

export const initializedEditor = (quiz: EditableQuiz) =>
  action("INITIALIZED_EDITOR", quiz)

export const editedQuizBody = (newBody: string, itemId: string) =>
  action("EDITED_QUIZ_ITEM_BODY", { body: newBody, id: itemId })

export const editedQuizItemTitle = (newTitle: string, itemId: string) =>
  action("EDITED_QUIZ_ITEM_TITLE", { title: newTitle, id: itemId })

export const editedQuizTitle = (newTitle: string) =>
  action("EDITED_QUIZ_TITLE", newTitle)

export const editedQuizzesNumberOfTries = (numberOfTries: number) =>
  action("EDITED_QUIZZES_NUMBER_OF_TRIES", numberOfTries)

export const editedQuizzesPointsToGain = (pointsToGain: number) =>
  action("EDITED_QUIZZES_POINTS_TO_GAIN", pointsToGain)

export const editedQuizzesPointsGrantingPolicy = (policy: string) =>
  action("EDITED_QUIZZES_POINTS_GRANTING_POLICY", policy)

export const editedOptionTitle = (
  newTitle: string,
  itemId: string,
  optionId: string,
) =>
  action("EDITED_OPTION_TITLE", {
    title: newTitle,
    itemId: itemId,
    optionId: optionId,
  })

export const editedOptionCorrectnes = (itemId: string, optionId: string) =>
  action("EDITED_OPTION_CORRECTNES", { itemId: itemId, optionId: optionId })

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
