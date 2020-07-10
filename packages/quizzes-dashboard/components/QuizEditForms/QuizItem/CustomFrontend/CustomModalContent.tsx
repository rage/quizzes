import React from "react"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import { Item } from "../../../../types/NormalizedQuiz"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../../store/store"

const EmptyBox = styled(Box)`
  width: 100% !important;
  height: 200px !important;
`

interface EditorModalProps {
  item: Item
}

export const CustomModalContent = ({ item }: EditorModalProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const dispatch = useDispatch()

  return (
    <>
      <EmptyBox />
    </>
  )
}

export default CustomModalContent
