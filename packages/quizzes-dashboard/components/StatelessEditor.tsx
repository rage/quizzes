import { Typography } from "@material-ui/core"
import React, { useLayoutEffect, useRef } from "react"
import styled from "styled-components"
import { useTypedSelector } from "../store/store"
import QuizItems from "./QuizEditForms/QuizItems"

const Wrapper = styled.div`
  /* Overflows break height calculations */
  overflow: hidden;
  box-sizing: border-box;
`

interface StatelessEditorProps {
  onHeightChange: (newHeight: number, port: MessagePort) => void
  port: MessagePort
}

const StatelessEditor: React.FC<StatelessEditorProps> = ({
  onHeightChange,
  port,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const store = useTypedSelector(state => state)

  useLayoutEffect(() => {
    const ref = contentRef.current
    if (!ref) {
      return
    }
    onHeightChange(ref.getBoundingClientRect().height, port)
  }, [store])

  return (
    <Wrapper ref={contentRef}>
      <QuizItems />
    </Wrapper>
  )
}

export default StatelessEditor
