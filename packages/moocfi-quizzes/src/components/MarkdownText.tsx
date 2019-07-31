import commonmark from "commonmark"
import * as React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { TypographyProps } from "@material-ui/core/Typography"
import { SpaciousTypography } from "./styleComponents"

interface IMarkdownTextProps extends TypographyProps {
  children: string
  text?: string
  Component?: typeof Typography
}

const MarkdownText: React.FunctionComponent<IMarkdownTextProps> = ({
  children,
  text,
  Component = SpaciousTypography,
  ...others
}) => {
  const reader = new commonmark.Parser()
  const writer = new commonmark.HtmlRenderer()

  const toBeWritten = reader.parse(children || text || "")

  return (
    <Component
      dangerouslySetInnerHTML={{
        __html: writer.render(toBeWritten),
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
