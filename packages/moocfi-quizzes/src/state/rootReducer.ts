export interface State {
  quizId: string | undefined
  test: string
}

const initialState: State = {
  quizId: undefined,
  test: "lolled",
}

const rootReducer = (state: State | undefined, _action) => {
  if (!state) {
    return initialState
  }
  return state
}

export default rootReducer
