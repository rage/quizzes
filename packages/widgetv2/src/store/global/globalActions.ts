import { createAction, createAsyncAction } from 'typesafe-actions'
import { AppThunk } from '..'

const downloadQuizSteps = createAsyncAction(
  'REQUEST_DOWNLOAD_QUIZ',
  ['SUCCESS_DOWNLOAD_QUIZ', (res: Response) => res],
  ['FAILURE_DOWNLOAD_QUIZ', (err: Error) => err]
)()

export const downloadQuiz = (quizId: string): AppThunk => async (dispatch) => {
  dispatch(downloadQuizSteps.request())
  try {
    const res = {}
    dispatch(downloadQuizSteps.success(res))
  } catch (e) {
    dispatch(downloadQuizSteps.failure(e))
  }
}
