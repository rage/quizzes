import React from "react"
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components"
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme,
} from "@mui/material/styles"
import { AppCacheProvider } from "@mui/material-nextjs/v16-pagesRouter"
import Layout from "../components/Layout"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { Provider } from "react-redux"
import store from "../store/store"
import "./index.css"

fontAwesomeConfig.autoAddCss = false

const GlobalStyle = createGlobalStyle`
html, body {
  padding: 0;
  margin: 0;
}
`

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

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: { fontSize: "2.5rem" },
        h2: { fontSize: "2rem" },
        h3: { fontSize: "1.75rem" },
        h4: { fontSize: "1.5rem" },
        h5: { fontSize: "1.25rem" },
        h6: { fontSize: "1rem" },
        body1: textScalar,
        body2: textScalar,
        caption: textScalar,
        overline: textScalar,
        subtitle1: textScalar,
        subtitle2: textScalar,
        button: textScalar,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

export default function App(props) {
  const { Component, pageProps } = props

  return (
    <AppCacheProvider {...props}>
      <Provider store={store}>
        <StyledThemeProvider theme={theme}>
          <MaterialThemeProvider theme={theme}>
            <GlobalStyle />
            {Component.noLayout ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </MaterialThemeProvider>
        </StyledThemeProvider>
      </Provider>
    </AppCacheProvider>
  )
}
