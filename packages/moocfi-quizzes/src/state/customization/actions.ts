import { createAction } from "typesafe-actions"

export const modify_show_points_info = createAction(
  "feedbackDisplayed/MODIFY_SHOW_POINTS_INFO",
  (resolve) => (newValue: boolean) => resolve(newValue),
)
