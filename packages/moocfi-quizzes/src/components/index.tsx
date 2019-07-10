import * as React from "react"
import { StylesProvider } from "@material-ui/styles"
import { QuizProps } from "./QuizImpl"
import QuizImpl from "./QuizImpl"
import { Provider } from "react-redux"
import createStoreInstance from "../state/store"

const Quiz: React.FunctionComponent<QuizProps> = props => {
  const store = createStoreInstance()

  return (
    <Provider store={store}>
      <StylesProvider injectFirst={true}>
        <QuizImpl {...props} />
      </StylesProvider>
    </Provider>
  )
}

export default Quiz
