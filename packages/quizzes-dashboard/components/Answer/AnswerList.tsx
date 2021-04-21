import { Button, Slide, Snackbar, Typography } from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions"
import { Alert } from "@material-ui/lab"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {
  setHandledAnswers,
  useAnswerListState,
} from "../../contexts/AnswerListContext"
import { changeAnswerStatusForMany } from "../../services/quizzes"
import { Answer } from "../../types/Answer"
import AnswerCard from "../Answer"
import { ButtonFieldWrapper } from "../Shared/ButtonFieldWrapper"

export interface AnswerListProps {
  data: Answer[]
  quizItemTypes: { [quizItemId: string]: string }[]
}

const BulkActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

export const AnswerList = ({ data, quizItemTypes }: AnswerListProps) => {
  const [showSnacks, setShowSnacks] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])

  const [{ bulkSelectedIds, handledAnswers }, dispatch] = useAnswerListState()

  useEffect(() => {
    if (data) setAnswers(data)
  }, [data])

  const numberOfAnswersSelected = bulkSelectedIds?.length
  const answersHaveBeenSelected = bulkSelectedIds?.length > 0

  const handleBulkAction = async (
    actionType: string,
    plagiarismSuspected = false,
  ) => {
    try {
      const res = await changeAnswerStatusForMany(
        bulkSelectedIds,
        actionType,
        plagiarismSuspected,
      )

      if (res[0].status === actionType) {
        setShowSnacks(true)
        dispatch(setHandledAnswers(res))

        const returnedIds = res.map((updated: Answer) => updated.id)

        setAnswers(
          answers.map(answer => {
            if (returnedIds.includes(answer.id)) {
              return { ...answer, status: actionType }
            }
            return answer
          }),
        )
      } else {
        setShowSnacks(true)
      }
    } catch (e) {
      throw e
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
        <Alert severity={handledAnswers ? "success" : "error"}>
          {handledAnswers ? (
            <Typography>
              {handledAnswers.length} answer(s) marked as{" "}
              {handledAnswers[0]?.status}
            </Typography>
          ) : (
            <Typography>
              Something went wrong while saving statuses, statuses not changed
            </Typography>
          )}
        </Alert>
      </Snackbar>
      {answersHaveBeenSelected && (
        <BulkActionWrapper>
          <Typography variant="h4">
            {numberOfAnswersSelected} answer(s) selected{" "}
          </Typography>
          <ButtonFieldWrapper>
            <Button
              className="button-accept"
              onClick={() => handleBulkAction("confirmed")}
            >
              {" "}
              <Typography>Accept all</Typography>
            </Button>
            <Button
              className="button-reject"
              onClick={() => handleBulkAction("rejected")}
            >
              {" "}
              <Typography>Reject all</Typography>
            </Button>
            <Button
              className="button-plagiarism"
              onClick={() => handleBulkAction("rejected", true)}
            >
              {" "}
              <Typography>Mark all as plagiarized</Typography>
            </Button>
          </ButtonFieldWrapper>
        </BulkActionWrapper>
      )}
      {answers.map(answer => (
        <AnswerCard key={answer.id} answer={answer} quizItemTypes={quizItemTypes}/>
      ))}
    </>
  )
}
