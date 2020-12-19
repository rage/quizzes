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

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
`

const ModalContentTitleWrapper = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: center;
`

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
        {/* <TextField
          fullWidth
          variant="outlined"
          label="Description for this quiz item"
          multiline
          rows={1}
          helperText="Use this if you cannot put the description in the 'Description for the whole quiz'-field. You may want to use this if have another quiz item before this one."
          defaultValue={storeItem.body}
        /> */}
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
          defaultValue={item.maxWords}
          type="number"
          onChange={event =>
            dispatch(editedItemMaxWords(item.id, Number(event.target.value)))
          }
        />
        <MinWords
          fullWidth
          label="Min words"
          variant="outlined"
          defaultValue={item.minValue}
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
