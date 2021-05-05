import * as React from "react"
import { StylesProvider } from "@material-ui/styles"
import { ThemeProvider } from "@material-ui/styles"
import { QuizProps } from "./QuizImpl"
import QuizImpl from "./QuizImpl"
import { Provider } from "react-redux"
import { createStoreCreator, Store } from "../state/store"
import quizzesTheme from "../themes"
import { initialize } from "../state/actions"
import { useEffect, useState } from "react"

const Quiz: React.FunctionComponent<QuizProps> = props => {
  const [store, setStore] = useState<Store | null>(null)

  const {
    id,
    languageId,
    accessToken,
    backendAddress,
    fullInfoWithoutLogin,
    showZeroPointsInfo,
  } = props

  useEffect(() => {
    const newStore = createStoreCreator()
    const initializeAction = initialize(
      id,
      languageId,
      accessToken,
      backendAddress,
      fullInfoWithoutLogin,
      showZeroPointsInfo,
    )
    newStore.dispatch(initializeAction as any)
    setStore(newStore)
  }, [
    id,
    languageId,
    accessToken,
    backendAddress,
    fullInfoWithoutLogin,
    showZeroPointsInfo,
  ])

  if (!store) {
    return null
  }

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
