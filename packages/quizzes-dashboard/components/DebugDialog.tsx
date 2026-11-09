import React, { useState } from "react"

import { denormalize, normalize } from "normalizr"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { Button, Dialog, Typography } from "@mui/material"

import { normalizedQuiz } from "../schemas"
import { initializedEditor } from "../store/editor/editorActions"
import { useTypedSelector } from "../store/store"
import { Quiz } from "../types/Quiz"
import EditableDebugField from "./EditableDebugField"

const DialogTitleContainer = styled.div`
  display: flex;
  padding: 1rem;
`

const CloseButton = styled(Button)`
  flex: 0;
`

const StyledDialogTitle = styled(Typography)`
  flex: 1;
`

const ContentWrapper = styled.div`
  overflow-y: hidden;
`

interface DebugDialogProps {
  object?: object
}

export const DebugDialog = ({ object }: DebugDialogProps) => {
  // holds changes to debug view changes for debouncing
  const [debugViewChanges, setDebugViewChanges] = useState<string | null>(null)

  const dispatch = useDispatch()
  const quizId = useTypedSelector((state) => state.editor.quizId)
  const initialQuiz = useTypedSelector(
    (state) => state.editor.quizVariables[quizId]?.initialState,
  )

  const editor = useTypedSelector((state) => state.editor)
  const data: object | Quiz =
    object ?? denormalize(quizId, normalizedQuiz, editor)

  const [debugOpen, setDebugOpen] = useState(false)
  const content = JSON.stringify(data, undefined, 2)

  const handleEditorChanges = () => {
    // Only the quiz editor's own state is editable; a passed `object` is read-only.
    if (object || !debugViewChanges || !initialQuiz) return
    setDebugViewChanges(null)

    let editedQuiz: Quiz
    try {
      editedQuiz = JSON.parse(debugViewChanges)
    } catch {
      return
    }

    const normalizedUpdatedQuizData = normalize(editedQuiz, normalizedQuiz)

    // cherry pick data pieces to put in state
    const normalizedDataToBeSentToEditorState = {
      quizzes: normalizedUpdatedQuizData.entities.quizzes ?? {},
      items: normalizedUpdatedQuizData.entities.items ?? {},
      options: normalizedUpdatedQuizData.entities.options ?? {},
      result: normalizedUpdatedQuizData.result,
      peerReviewCollections:
        normalizedUpdatedQuizData.entities.peerReviewCollections ?? {},
      questions: normalizedUpdatedQuizData.entities.questions ?? {},
    }

    // Keeps the saved state as the baseline so the edits show up as unsaved changes.
    dispatch(
      initializedEditor(
        normalizedDataToBeSentToEditorState,
        initialQuiz as Quiz,
      ),
    )
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setDebugOpen(true)}>
        Debug
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={debugOpen}
        onClose={() => {
          handleEditorChanges()
          setDebugOpen(false)
        }}
      >
        <DialogTitleContainer>
          <StyledDialogTitle variant="h4">Debug information</StyledDialogTitle>
          <CloseButton
            variant="outlined"
            onClick={() => {
              handleEditorChanges()
              setDebugOpen(false)
            }}
          >
            Close
          </CloseButton>
        </DialogTitleContainer>
        <ContentWrapper>
          <EditableDebugField
            initialValue={content}
            setDebugViewChanges={setDebugViewChanges}
          />
        </ContentWrapper>
      </Dialog>
    </>
  )
}

export default DebugDialog
