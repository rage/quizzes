import { createAction } from "typesafe-actions"
import { Entities } from "../../types/NormalizedQuiz"

export const initializedEditor = createAction(
  "INITIALIZED_EDITOR",
  (quiz: Entities) => ({ quiz: quiz }),
)<{ quiz: Entities }>()
