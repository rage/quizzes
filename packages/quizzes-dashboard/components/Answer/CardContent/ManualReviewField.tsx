import React, { useState } from "react"
import { Button, Typography, Snackbar, Slide } from "@material-ui/core"
import styled from "styled-components"
import { Answer } from "../../../types/Answer"
import { changeAnswerStatus } from "../../../services/quizzes"
import { Alert } from "@material-ui/lab"
import { TransitionProps } from "@material-ui/core/transitions"
import { ButtonFieldWrapper } from "../../Shared/ButtonFieldWrapper"
import {
  setStatusUpdateType,
  setUpdatedAnswersIds,
  useAnswerListState,
} from "../../../contexts/AnswerListContext"

export const RejectButton = styled(Button)`
  display: flex !important;
  border-color: red !important;
  border-width: 5px !important;
`

export interface ManualReviewProps {
  answer: Answer
}

export const ManualReviewField = ({ answer }: ManualReviewProps) => {
  const [success, setSuccess] = useState(true)
  const [showSnacks, setShowSnacks] = useState(false)

  const [, dispatch] = useAnswerListState()

  const handleAcceptOrReject = async (answerId: string, status: string) => {
    try {
      const res = await changeAnswerStatus(answerId, status)
      if (res.status === status) {
        dispatch(setUpdatedAnswersIds([answer.id]))
        setSuccess(true)
        setShowSnacks(true)
        dispatch(setStatusUpdateType(status))
      } else {
        dispatch(setUpdatedAnswersIds([answer.id]))
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
      <ButtonFieldWrapper>
        <Button
          className="button-accept"
          onClick={() => handleAcceptOrReject(answer.id, "confirmed")}
        >
          <Typography>Accept</Typography>
        </Button>
        <Button
          className="button-reject"
          onClick={() => handleAcceptOrReject(answer.id, "rejected")}
        >
          <Typography>Reject</Typography>
        </Button>
      </ButtonFieldWrapper>
    </>
  )
}

export default ManualReviewField
