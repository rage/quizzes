import * as commonmark from "commonmark"
import * as React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { TypographyProps } from "@material-ui/core/Typography"
import { SpaciousTypography } from "./styleComponents"

interface IMarkdownTextProps extends TypographyProps {
  children: string
  text?: string
  Component?: any
  removeParagraphs?: boolean
}

const MarkdownText: React.FunctionComponent<IMarkdownTextProps> = ({
  children,
  text,
  Component = SpaciousTypography,
  removeParagraphs,
  ...others
}) => {
  const reader = new commonmark.Parser()
  const writer = new commonmark.HtmlRenderer()

  const toBeWritten = reader.parse(children || text || "")
  let html = writer.render(toBeWritten)
  if (removeParagraphs) {
    html = html.replace(/<p>/g, "<div>")
    html = html.replace(/<\/p>/g, "</div>")
  }

  return (
    <Component
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      {...others}
    />
  )
}

export default styled(MarkdownText)`
  p,
  pre {
    margin-top: 0;
  }
`
