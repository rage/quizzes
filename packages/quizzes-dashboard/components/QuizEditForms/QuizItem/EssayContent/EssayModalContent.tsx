import React from "react"
import styled from "styled-components"
import { TextField, Typography } from "@material-ui/core"
import { useTypedSelector } from "../../../../store/store"
import { NormalizedItem } from "../../../../types/NormalizedQuiz"
import { useDispatch } from "react-redux"
import {
  editedItemMinWords,
  editedItemMaxWords,
  editedQuizItemBody,
} from "../../../../store/editor/items/itemAction"
import MarkdownEditor from "../../../MarkdownEditor"
import { ModalContent, ModalContentTitleWrapper } from "../../../Shared/Modal"

const MaxWords = styled(TextField)`
  display: flex !important;
  margin-right: 0.5rem !important;
`

const MinWords = styled(TextField)`
  display: flex !important;
  margin-left: 0.5rem !important;
`

interface ModalContentProps {
  item: NormalizedItem
}

export const EssayModalContent = ({ item }: ModalContentProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const dispatch = useDispatch()
  return (
    <>
      <ModalContentTitleWrapper>
        <Typography variant="h3">Advanced Editing</Typography>
      </ModalContentTitleWrapper>
      <ModalContent>
        <MarkdownEditor
          label="Description for this quiz item"
          text={storeItem.body ?? ""}
          onChange={event =>
            dispatch(editedQuizItemBody(event.target.value, storeItem.id))
          }
        />
      </ModalContent>
      <ModalContent>
        <MaxWords
          fullWidth
          label="Max words"
          variant="outlined"
          value={item.maxWords ?? ""}
          type="number"
          onChange={event =>
            dispatch(editedItemMaxWords(item.id, Number(event.target.value)))
          }
        />
        <MinWords
          fullWidth
          label="Min words"
          variant="outlined"
          value={item.minValue ?? ""}
          type="number"
          onChange={event =>
            dispatch(editedItemMinWords(item.id, Number(event.target.value)))
          }
        />
      </ModalContent>
    </>
  )
}

export default EssayModalContent
