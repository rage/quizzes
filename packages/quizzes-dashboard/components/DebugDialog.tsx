import React, { useState } from "react"
import { Button, Dialog, Typography } from "@material-ui/core"
import styled from "styled-components"
import EditableDebugField from "./EditableDebugField"
import { NormalizedItem, NormalizedQuiz } from "../types/NormalizedQuiz"
import { useTypedSelector } from "../store/store"
import { normalizedQuiz, items } from "../schemas"
import { denormalize } from "normalizr"
import { Quiz } from "../types/Quiz"

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

export const DebugDialog = () => {
  const quizId = useTypedSelector(state => state.editor.quizId)
  const quiz = useTypedSelector(state => state.editor)
  const data: Quiz = denormalize(quizId, normalizedQuiz, quiz)

  const [debugOpen, setDebugOpen] = useState(false)
  const content = JSON.stringify(data, undefined, 2)
  return (
    <>
      <Button variant="outlined" onClick={() => setDebugOpen(true)}>
        Debug
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={debugOpen}
        onClose={() => setDebugOpen(false)}
      >
        <DialogTitleContainer>
          <StyledDialogTitle variant="h4">Debug information</StyledDialogTitle>
          <CloseButton variant="outlined" onClick={() => setDebugOpen(false)}>
            Close
          </CloseButton>
        </DialogTitleContainer>
        <ContentWrapper>
          <EditableDebugField initialValue={content} />
        </ContentWrapper>
      </Dialog>
    </>
  )
}

export default DebugDialog
