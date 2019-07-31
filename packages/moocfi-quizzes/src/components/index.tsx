import * as React from "react"
import { StylesProvider } from "@material-ui/styles"
import { ThemeProvider } from "@material-ui/styles"
import { QuizProps } from "./QuizImpl"
import QuizImpl from "./QuizImpl"
import { Provider } from "react-redux"
import createStoreInstance from "../state/store"
import quizzesTheme from "../themes"

const Quiz: React.FunctionComponent<QuizProps> = props => {
  const store = createStoreInstance()

  return (
    <Provider store={store}>
      <StylesProvider injectFirst={true}>
        <ThemeProvider theme={quizzesTheme}>
          <QuizImpl {...props} />
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  )
}

export default Quiz
