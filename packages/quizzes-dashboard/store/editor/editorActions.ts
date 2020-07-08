import { createAction } from "typesafe-actions"
import { Entities } from "../../types/NormalizedQuiz"
import { EditableQuiz } from "../../types/EditQuiz"

export const initializedEditor = createAction(
  "INITIALIZED_EDITOR",
  (normalizedQuiz: Entities, nestedQuiz: EditableQuiz) => ({
    normalizedQuiz: normalizedQuiz,
    nestedQuiz: nestedQuiz,
  }),
)<{ normalizedQuiz: Entities; nestedQuiz: EditableQuiz }>()
