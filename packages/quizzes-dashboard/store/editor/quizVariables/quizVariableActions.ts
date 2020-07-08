import { createAction } from "typesafe-actions"
import { EditableQuiz } from "../../../types/EditQuiz"

export const setInitialState = createAction(
  "SET_INITIAL_STATE",
  (quizId: string, quiz: EditableQuiz) => ({
    quizId: quizId,
    quiz: quiz,
  }),
)<{ quizId: string; quiz: EditableQuiz }>()
