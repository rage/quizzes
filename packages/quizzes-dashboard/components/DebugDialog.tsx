import React, { useState } from "react"
import { Button, Dialog, DialogContent, Typography } from "@material-ui/core"
import styled from "styled-components"

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

interface DebugDialogProps {
  data: any
}

export default ({ data }: DebugDialogProps) => {
  const [debugOpen, setDebugOpen] = useState(false)
  return (
    <>
      {" "}
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

        <DialogContent>
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </DialogContent>
      </Dialog>
    </>
  )
}
