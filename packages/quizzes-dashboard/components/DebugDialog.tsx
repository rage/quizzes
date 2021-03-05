import React, { useState } from "react"
import { Button, Dialog, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import EditableDebugField from "./EditableDebugField"
import { useTypedSelector } from "../store/store"
import { normalizedQuiz } from "../schemas"
import { denormalize, normalize } from "normalizr"
import { Quiz } from "../types/Quiz"
import { useQuiz } from "../hooks/useQuiz"
import { initializedEditor } from "../store/editor/editorActions"

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
  object?: Object
}

export const DebugDialog = ({ object }: DebugDialogProps) => {
  // holds changes to debug view changes for debouncing
  const [debugViewChanges, setDebugViewChanges] = useState<string | null>(null)

  const dispatch = useDispatch()
  const quizId = useTypedSelector(state => state.editor.quizId)
  const { quiz } = useQuiz(quizId, `quiz-${quizId}`)

  let data: Object | Quiz

  if (object) {
    data = object
  } else {
    const quizId = useTypedSelector(state => state.editor.quizId)
    const quiz = useTypedSelector(state => state.editor)
    data = denormalize(quizId, normalizedQuiz, quiz)
  }

  const [debugOpen, setDebugOpen] = useState(false)
  const content = JSON.stringify(data, undefined, 2)

  const handleEditorChanges = () => {
    if (!debugViewChanges) return

    // check if JSON changes are valid
    try {
      JSON.parse(debugViewChanges as string)
    } catch (err) {
      setDebugViewChanges(null)
      return
    }

    // normalize quiz
    const normalizedUpdatedQuizData = normalize(
      debugViewChanges,
      normalizedQuiz,
    )

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

    // send to state
    dispatch(initializedEditor(normalizedDataToBeSentToEditorState, quiz!))
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
