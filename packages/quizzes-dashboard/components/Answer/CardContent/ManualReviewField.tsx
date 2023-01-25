import React, { useEffect, useState } from "react"
import { Button, Typography, Snackbar, Slide } from "@material-ui/core"
import styled from "styled-components"
import { Answer } from "../../../types/Answer"
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

export interface ManualReviewProps {
  answer: Answer
}

export const ManualReviewField = ({ answer }: ManualReviewProps) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<null | Error>(null)
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
  ) => {
    try {
      setError(null)
      const res = await changeAnswerStatus(
        answerId,
        status,
        plagiarismSuspected,
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
      if (e instanceof Error) {
        setError(e)
      }
      setShowSnacks(true)
      setSuccess(false)
    }
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
              Something went wrong while saving status, status not changed.
              {error && (
                <>
                  <p>
                    Reason: <pre>{error.toString()}</pre>
                  </p>
                  {/* @ts-expect-error: axios property error.response */}
                  {error?.response?.data && <p>{error.response.data}</p>}
                </>
              )}
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
        <Button
          className="button-plagiarism"
          onClick={() => {
            handleAcceptOrReject(answer.id, "rejected", true)
          }}
        >
          <Typography>Suspect plagiarism</Typography>
        </Button>
      </ButtonFieldWrapper>
    </>
  )
}

export default ManualReviewField
