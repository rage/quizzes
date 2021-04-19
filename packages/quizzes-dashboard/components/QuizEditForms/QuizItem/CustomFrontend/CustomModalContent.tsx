import React from "react"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"

const EmptyBox = styled(Box)`
  width: 100%;
  height: 200px;
`

interface EditorModalProps {
  item: NormalizedItem
}

export const CustomModalContent = ({ item }: EditorModalProps) => {
  return (
    <>
      <EmptyBox />
    </>
  )
}

export default CustomModalContent
