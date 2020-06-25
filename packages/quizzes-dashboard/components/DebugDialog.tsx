import React, { useState } from "react"
import { Button, Dialog, Typography } from "@material-ui/core"
import styled from "styled-components"
import EditableDebugField from "./EditableDebugField"
import { Item, Quiz } from "../types/NormalizedQuiz"
import { useTypedSelector } from "../store/store"

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

const StyledPreWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
`

interface DebugDialogProps {
  passedData?: Item
  editable?: boolean
}

const DebugDialog = ({ passedData, editable }: DebugDialogProps) => {
  let data: { [quizId: string]: Quiz } | Item = useTypedSelector(
    state => state.editor.quizzes,
  )
  if (passedData) {
    data = passedData
  }
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
          {editable ? (
            <EditableDebugField initialValue={content} />
          ) : (
            <StyledPreWrapper>
              <pre>{content}</pre>
            </StyledPreWrapper>
          )}
        </ContentWrapper>
      </Dialog>
    </>
  )
}

export default DebugDialog
