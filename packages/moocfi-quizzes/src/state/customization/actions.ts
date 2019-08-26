import { createAction } from "typesafe-actions"

export const modify_always_show_points = createAction(
  "feedbackDisplayed/MODIFY_ALWAYS_SHOW_POINTS",
  resolve => (newValue: boolean) => resolve(newValue),
)
