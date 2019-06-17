import * as React from "react"
import { Props } from "./QuizImpl"
import QuizImpl from "./QuizImpl"
import { Provider } from "react-redux"
import createStoreInstance from "../state/store"

const Quiz: React.FunctionComponent<Props> = props => {
  const store = createStoreInstance()
  return (
    <Provider store={store}>
      <QuizImpl {...props} />
    </Provider>
  )
}

export default Quiz
