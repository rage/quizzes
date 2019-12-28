import React from "react"
import NextDocument from "next/document"
import {
  ServerStyleSheet as StyledComponentSheets,
  createGlobalStyle,
} from "styled-components"
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/styles"

const GlobalStyle = createGlobalStyle`
html, body {
  padding: 0;
  margin: 0;
}
`

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const styledComponentSheet = new StyledComponentSheets()
    const materialUiSheets = new MaterialUiServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            styledComponentSheet.collectStyles(
              materialUiSheets.collect(<App {...props} />),
            ),
        })

      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: [
          <React.Fragment key="styles">
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {styledComponentSheet.getStyleElement()}
            <GlobalStyle />
          </React.Fragment>,
        ],
      }
    } finally {
      styledComponentSheet.seal()
    }
  }
}
