import React, { useState } from "react"
import { Button, Typography, Snackbar, Slide } from "@material-ui/core"
import styled from "styled-components"
import { Answer } from "../../../types/Answer"
import { changeAnswerStatus } from "../../../services/quizzes"
import { Alert } from "@material-ui/lab"
import { TransitionProps } from "@material-ui/core/transitions"

export const ButtonField = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-around;

  .MuiButton-label {
    font-size: 1rem;
    padding: 0.2rem;
  }

  #button-accept {
    background-color: #78ab46;
    color: white;
  }
  #button-reject {
    background-color: #f44336;
    color: white;
  }
`

export const AcceptButton = styled(Button)`
  display: flex !important;
`

export const RejectButton = styled(Button)`
  display: flex !important;
  border-color: red !important;
  border-width: 5px !important;
`

export interface ManualReviewProps {
  answer: Answer
  handled?: boolean
  setHandled: (handled: boolean) => void
  setStatus: (accepted: string) => void
}

export const ManualReviewField = ({
  answer,
  setHandled,
  setStatus,
}: ManualReviewProps) => {
  const [success, setSuccess] = useState(true)
  const [showSnacks, setShowSnacks] = useState(false)

  const handleAcceptOrReject = async (answerId: string, status: string) => {
    try {
      const res = await changeAnswerStatus(answerId, status)
      if (res.status === status) {
        setHandled(true)
        setSuccess(true)
        setShowSnacks(true)
        setStatus(status)
      } else {
        setHandled(true)
        setSuccess(false)
        setShowSnacks(true)
      }
    } catch (e) {
      setShowSnacks(true)
      setSuccess(false)
    }
  }
  return (
    <>
      <Snackbar
        open={showSnacks}
        onClose={() => setShowSnacks(false)}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props: TransitionProps) => {
          return <Slide {...props} direction="down" />
        }}
      >
        <Alert severity={success ? "success" : "error"}>
          {success ? (
            <Typography>Answer status saved succesfully</Typography>
          ) : (
            <Typography>
              Something went wrong while saving status, status not changed
            </Typography>
          )}
        </Alert>
      </Snackbar>
      <ButtonField>
        <AcceptButton
          id="button-accept"
          variant="outlined"
          onClick={() => handleAcceptOrReject(answer.id, "confirmed")}
        >
          <Typography>Accept</Typography>
        </AcceptButton>
        <RejectButton
          id="button-reject"
          variant="outlined"
          onClick={() => handleAcceptOrReject(answer.id, "rejected")}
        >
          <Typography>Reject</Typography>
        </RejectButton>
      </ButtonField>
    </>
  )
}

export default ManualReviewField
