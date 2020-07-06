import React, { useState } from "react"
import styled from "styled-components"
import { Modal, Box, Button, Fade } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Option } from "../../../../types/NormalizedQuiz"
import OptionEditorModalContent from "./OptionEditorModalContent"
import store, { useTypedSelector } from "../../../../store/store"
import { deletedOptionFromItem } from "../../../../store/editor/items/itemAction"
import { deletedOptionFromOptions } from "../../../../store/editor/options/optionActions"
import { useDispatch } from "react-redux"

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledBox = styled(Box)`
  background-color: #fafafa;
  min-width: 700px;
  min-height: 500px;
`

const CloseButton = styled(Button)`
  padding: 1rem !important;
  float: right;
`

const DeleteOptionButton = styled(Button)`
  display: flex;
  padding: 1rem !important;
  position: relative !important;
  left: 85% !important;
`

const CorrectButton = styled(Button)`
  display: flex;
  border-width: 5px 5px 5px 5px !important;
  border-color: green !important;
`

const IncorrectButton = styled(Button)`
  display: flex;
  border-width: 5px 5px 5px 5px !important;
  border-color: red !important;
`

interface multipleChoiceButtonProps {
  option: Option
}

const MultipleChoiceButton = ({ option }: multipleChoiceButtonProps) => {
  const storeOption = useTypedSelector(state => state.editor.options[option.id])
  const [editOption, setEditOption] = useState(false)
  const dispatch = useDispatch()

  return (
    <>
      <StyledModal open={editOption} onClose={() => setEditOption(false)}>
        <Fade in={editOption}>
          <StyledBox>
            <CloseButton onClick={() => setEditOption(false)}>
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <OptionEditorModalContent option={storeOption} />
            <DeleteOptionButton
              onClick={() => {
                setEditOption(false)
                dispatch(
                  deletedOptionFromItem(storeOption.quizItemId, storeOption.id),
                )
                dispatch(deletedOptionFromOptions(storeOption.id))
              }}
            >
              <FontAwesomeIcon icon={faTrash} size="2x" color="red" />
            </DeleteOptionButton>
          </StyledBox>
        </Fade>
      </StyledModal>
      {storeOption.correct ? (
        <>
          <CorrectButton onClick={() => setEditOption(true)} variant="outlined">
            {storeOption.title}
          </CorrectButton>
        </>
      ) : (
        <>
          <IncorrectButton
            onClick={() => setEditOption(true)}
            variant="outlined"
          >
            {storeOption.title}
          </IncorrectButton>
        </>
      )}
    </>
  )
}

export default MultipleChoiceButton
