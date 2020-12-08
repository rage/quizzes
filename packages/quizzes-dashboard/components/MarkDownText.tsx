import React from "react"
import { HtmlRenderer, Parser } from "commonmark"
import styled from "styled-components"

const PreviewDiv = styled.div`
  min-height: 400px;
`

interface MarkDownTextProps {
  text: string
}

export const MarkDownText = ({ text }: MarkDownTextProps) => {
  const reader = new Parser()
  const writer = new HtmlRenderer()

  return (
    <PreviewDiv
      dangerouslySetInnerHTML={{
        __html: writer.render(reader.parse(text)),
      }}
    />
  )
}
