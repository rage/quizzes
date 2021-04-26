import NextApp from "next/app"
import React from "react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"
import {
  ThemeProvider as MaterialThemeProvider,
  createMuiTheme,
  StylesProvider,
} from "@material-ui/core/styles"
import Layout from "../components/Layout"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { Provider } from "react-redux"
import store from "../store/store"

fontAwesomeConfig.autoAddCss = false

const textScalar = {
  "@media only screen and (max-width:600px)": {
    fontSize: "60%",
  },
  "@media only screen and (min-width:600px)": {
    fontSize: "70%",
  },
  "@media only screen and (min-width:768px)": {
    fontSize: "80%",
  },
  "@media only screen and (min-width:992px)": {
    fontSize: "90%",
  },
  "@media only screen and (min-width:1200px)": {
    fontSize: "100%",
  },
}

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      h1: { fontSize: "2.5rem" },
      h2: { fontSize: "2rem" },
      h3: { fontSize: "1.75rem" },
      h4: { fontSize: "1.5rem" },
      h5: { fontSize: "1.25rem" },
      h6: { fontSize: "1rem" },
      paragraph: textScalar,
      body1: textScalar,
      body2: textScalar,
      caption: textScalar,
      overline: textScalar,
      srOnly: textScalar,
      subtitle1: textScalar,
      subtitle2: textScalar,
      button: textScalar,
    },
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
        <StylesProvider injectFirst>
          <StyledThemeProvider theme={theme}>
            <MaterialThemeProvider theme={theme}>
              {Component.noLayout ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </MaterialThemeProvider>
          </StyledThemeProvider>
        </StylesProvider>
      </Provider>
    )
  }
}
