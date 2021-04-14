import {
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grow,
  Divider,
  FormHelperText,
} from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React, { useState } from "react"
import styled from "styled-components"
import { deleteQuizAnswer } from "../../../services/quizzes"
import { Answer } from "../../../types/Answer"

const TextWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const YesButton = styled(Button)`
  display: flex !important;
  background-color: #78ab46 !important;
`

const NoButton = styled(Button)`
  display: flex !important;
  background-color: #c62828 !important;
`

interface AnswerDeletionDialogProps {
  setShowAnswerDeletionModal: (arg: boolean) => void
  showAnswerDeletionModal: boolean
  answer: Answer
}

const AnswerDeletionDialog = ({
  setShowAnswerDeletionModal: setShowAnswerDeletionDialog,
  showAnswerDeletionModal: showAnswerDeletionDialog,
  answer,
}: AnswerDeletionDialogProps) => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleReject = () => {
    setShowAnswerDeletionDialog(false)
  }

  const handleAccept = async () => {
    setDeleting(true)
    const response = await deleteQuizAnswer(answer.id)
    if (response.data.deleted) {
      setSuccess(true)
      setTimeout(() => setShowAnswerDeletionDialog(false), 3000)
    } else {
      setFailure(true)
    }
    setDeleting(false)
  }

  return (
    <Dialog open={showAnswerDeletionDialog} fullWidth>
      <DialogTitle>
        <Typography>Are you sure you want to delete this answer?</Typography>
      </DialogTitle>
      <DialogContent>
        {!deleting && (
          <>
            <Divider />
            <FormHelperText>Basic info</FormHelperText>
            <TextWrapper>
              <Typography variant="caption">id: {answer.id}</Typography>
            </TextWrapper>
            <TextWrapper>
              <Typography variant="caption">
                user_id: {answer.userId}
              </Typography>
            </TextWrapper>
            <TextWrapper>
              <Typography variant="caption">status: {answer.status}</Typography>
            </TextWrapper>
            {answer.itemAnswers[0]?.textData && (
              <>
                <Divider />
                <FormHelperText>Answer text</FormHelperText>
                <TextWrapper>
                  <Typography>{answer.itemAnswers[0].textData}</Typography>
                </TextWrapper>
              </>
            )}
          </>
        )}
        {deleting && !failure && !success && (
          <>
            <CircularProgress />
          </>
        )}
        {!deleting && success && (
          <>
            <Grow in={success}>
              <Alert severity="success">
                <Typography variant="caption">
                  Answer deleted successfully
                </Typography>
              </Alert>
            </Grow>
          </>
        )}
        {!deleting && failure && (
          <>
            <Grow in={success}>
              <Alert severity="warning">
                <Typography variant="caption">
                  Something went wrong, answer couldn't be deleted
                </Typography>
              </Alert>
            </Grow>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <YesButton variant="outlined" onClick={handleAccept}>
          <Typography variant="caption">Yes</Typography>
        </YesButton>
        <NoButton variant="outlined" onClick={handleReject}>
          <Typography variant="caption">No</Typography>
        </NoButton>
      </DialogActions>
    </Dialog>
  )
}

export default AnswerDeletionDialog
