import React from "react"

import styled from "styled-components"

import { Box } from "@mui/material"

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
