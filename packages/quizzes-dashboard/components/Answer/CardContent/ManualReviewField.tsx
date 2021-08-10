import React, { useEffect, useState } from "react"
import { Button, Typography, Snackbar, Slide, Tooltip } from "@material-ui/core"
import styled from "styled-components"
import { Answer } from "../../../types/Answer"
import { withStyles, makeStyles } from "@material-ui/core/styles"

import {
  changeAnswerStatus,
  logSuspectedPlagiarism,
} from "../../../services/quizzes"
import { Alert } from "@material-ui/lab"
import { TransitionProps } from "@material-ui/core/transitions"
import { ButtonFieldWrapper } from "../../Shared/ButtonFieldWrapper"
import {
  setHandledAnswers,
  useAnswerListState,
} from "../../../contexts/AnswerListContext"
import { useAnswer } from "../../../hooks/useAnswer"

export const RejectButton = styled(Button)`
  display: flex !important;
  border-color: red !important;
  border-width: 5px !important;
`

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    boxShadow: theme.shadows[1],
    fontSize: "0.9rem",
  },
}))(Tooltip)

export interface ManualReviewProps {
  answer: Answer
}

export const ManualReviewField = ({ answer }: ManualReviewProps) => {
  const [success, setSuccess] = useState(false)
  const [showSnacks, setShowSnacks] = useState(false)
  const [, dispatch] = useAnswerListState()

  const { mutate } = useAnswer(answer.id, `answer-${answer.id}}`)
  useEffect(() => {
    setShowSnacks(false)
  }, [answer])

  const handleAcceptOrReject = async (
    answerId: string,
    status: string,
    plagiarismSuspected = false,
    plagiarismConfirmed = false,
  ) => {
      try {
        const res = await changeAnswerStatus(
          answerId,
          status,
          plagiarismSuspected,
          plagiarismConfirmed,
        )
        if (res.status === status) {
          mutate()
          setSuccess(true)
          setShowSnacks(true)
          dispatch(setHandledAnswers([res]))
        } else {
          setSuccess(false)
          setShowSnacks(true)
        }
      } catch (e) {
        setShowSnacks(true)
        setSuccess(false)
      
  }

  return (
    <>
      <Snackbar
        open={showSnacks}
        autoHideDuration={5000}
        onClose={() => setShowSnacks(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props: TransitionProps) => {
          return <Slide {...props} direction="down" />
        }}
      >
        <Alert severity={success ? "success" : "error"}>
          {success ? (
            <Typography>Answer status saved successfully</Typography>
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
        {answer.plagiarismCheckStatus !== "plagiarism-suspected" ? (
          <Button
            className="button-reject"
            onClick={() => handleAcceptOrReject(answer.id, "rejected")}
          >
            <Typography>Reject</Typography>false
          </Button>
        ) : (
          <StyledTooltip title="Answer is plagiarized and will be rejected.">
            <Button
              className="button-reject"
              onClick={() =>
                handleAcceptOrReject(answer.id, "rejected", false, true)
              }
            >
              <Typography>Plagiarized</Typography>
            </Button>
          </StyledTooltip>
        )}
        {answer.plagiarismCheckStatus !== "plagiarism-suspected" ? (
          <Button
            className="button-suspect-plagiarism"
            onClick={() => {
              handleAcceptOrReject(answer.id, "rejected", true, true)
            }}
          >
            <Typography>Suspect plagiarism</Typography>
          </Button>
        ) : (
          <StyledTooltip title="Answer is not plagiarized but not acceptable. Answer will be rejected.">
            <Button
              className="button-reject-not-plagiarism"
              onClick={() => {
                handleAcceptOrReject(answer.id, "rejected")
              }}
            >
              <Typography>Reject</Typography>
            </Button>
          </StyledTooltip>
        )}
      </ButtonFieldWrapper>
    </>
  )
}

export default ManualReviewField
