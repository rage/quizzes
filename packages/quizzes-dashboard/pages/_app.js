import NextApp from "next/app"
import React from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles"
import Layout from "../components/Layout"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { Provider } from "react-redux"
import store from "../store/store"

fontAwesomeConfig.autoAddCss = false

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      label: {
        textTransform: "none",
      },
      root: {
        textTransform: "none",
      },
    },
  },
})
export default class App extends NextApp {
  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Provider store={store}>
        <StyledThemeProvider theme={theme}>
          <MaterialThemeProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MaterialThemeProvider>
        </StyledThemeProvider>
      </Provider>
    )
  }
}
