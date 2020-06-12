import React, { useState } from "react"
import { Button, Dialog, Typography } from "@material-ui/core"
import styled from "styled-components"
import EditableDebugField from "./EditableDebugField"
import { EditorState } from "../store/edit/reducers"
import { connect } from "react-redux"
import { Item } from "../types/EditQuiz"

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
  storeData?: EditorState
  passedData?: Item
  editable?: boolean
}

const DebugDialog = ({ storeData, passedData, editable }: DebugDialogProps) => {
  let data: EditorState | Item | undefined = storeData
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

const mapStateToProps = (state: EditorState) => {
  return {
    storeData: { ...state },
  }
}

export default connect(mapStateToProps, null)(DebugDialog)
