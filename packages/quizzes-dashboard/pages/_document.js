import React from "react"
import { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v16-pagesRouter"

export default function Document(props) {
  return (
    <Html>
      <Head>
        {/* Emotion's insertion point must precede the styled-components tags so app styles override MUI */}
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async ctx => {
  const styledComponentSheet = new ServerStyleSheet()
  try {
    return await documentGetInitialProps(ctx, {
      plugins: [
        {
          enhanceApp: App => props =>
            styledComponentSheet.collectStyles(<App {...props} />),
          resolveProps: async initialProps => ({
            ...initialProps,
            styles: [
              ...React.Children.toArray(initialProps.styles),
              styledComponentSheet.getStyleElement(),
            ],
          }),
        },
      ],
    })
  } finally {
    styledComponentSheet.seal()
  }
}
