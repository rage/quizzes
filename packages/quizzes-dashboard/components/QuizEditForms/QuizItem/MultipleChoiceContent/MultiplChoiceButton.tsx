import React from "react"
import styled from "styled-components"
import { Modal, Box, Button, Fade } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Option } from "../../../../types/NormalizedQuiz"
import OptionEditorModalContent from "./OptionEditorModalContent"
import { useTypedSelector } from "../../../../store/store"
import { useDispatch } from "react-redux"
import { setOptionEditing } from "../../../../store/editor/optionVariables/optionVariableActions"
import { deletedOption } from "../../../../store/editor/editorActions"

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
  const variables = useTypedSelector(
    state => state.editor.optionVariables[option.id],
  )
  const dispatch = useDispatch()

  return (
    <>
      <StyledModal
        open={variables.optionEditing}
        onClose={() => dispatch(setOptionEditing(storeOption.id, false))}
      >
        <Fade in={variables.optionEditing}>
          <StyledBox>
            <CloseButton
              onClick={() => dispatch(setOptionEditing(storeOption.id, false))}
            >
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </CloseButton>
            <OptionEditorModalContent option={storeOption} />
            <DeleteOptionButton
              onClick={() => {
                dispatch(setOptionEditing(storeOption.id, false))
                dispatch(deletedOption(storeOption.id, storeOption.quizItemId))
              }}
            >
              <FontAwesomeIcon icon={faTrash} size="2x" color="red" />
            </DeleteOptionButton>
          </StyledBox>
        </Fade>
      </StyledModal>
      {storeOption.correct ? (
        <>
          <CorrectButton
            onClick={() => dispatch(setOptionEditing(storeOption.id, true))}
            variant="outlined"
          >
            {storeOption.title}
          </CorrectButton>
        </>
      ) : (
        <>
          <IncorrectButton
            onClick={() => dispatch(setOptionEditing(storeOption.id, true))}
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
