import { Button, Slide, Snackbar, Typography } from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions"
import { Alert } from "@material-ui/lab"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { changeAnswerStatusForMany } from "../../services/quizzes"
import { Answer } from "../../types/Answer"
import AnswerCard from "../Answer"
import { ButtonFieldWrapper } from "../Shared/ButtonFieldWrapper"

export interface AnswerListProps {
  data: Answer[]
  expandAll: boolean
  bulkSelectMode: boolean
  bulkSelectedIds: string[]
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

export const AnswerList = ({
  data,
  expandAll,
  bulkSelectMode,
  bulkSelectedIds,
}: AnswerListProps) => {
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>([])
  const [showSnacks, setShowSnacks] = useState(false)
  const [updatedAnswers, setUpdatedAnswers] = useState<null | Answer[]>(null)
  const [status, setStatus] = useState("")
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    setSelectedAnswerIds(bulkSelectedIds)
    data && setAnswers(data)
  }, [bulkSelectedIds])

  const numberOfAnswersSelected = selectedAnswerIds.length
  const answersHaveBeenSelected = selectedAnswerIds.length > 0

  const handleBulkAction = async (actionType: string) => {
    try {
      const res = await changeAnswerStatusForMany(selectedAnswerIds, actionType)
      if (res[0].status === actionType) {
        setUpdatedAnswers(res)
        setShowSnacks(true)
        setStatus(actionType)
        setSelectedAnswerIds([])

        const returnedIds = res.map(updated => updated.id)

        setAnswers(
          answers.map(answer => {
            if (returnedIds.includes(answer.id)) {
              return { ...answer, status: actionType }
            }
            return answer
          }),
        )
      } else {
        setUpdatedAnswers(res)
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
        <Alert severity={updatedAnswers ? "success" : "error"}>
          {updatedAnswers ? (
            <Typography>
              {updatedAnswers.length} answer(s) marked as{" "}
              {updatedAnswers[0].status}
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
          </ButtonFieldWrapper>
        </BulkActionWrapper>
      )}
      {answers.map(answer => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          expanded={expandAll}
          bulkSelectMode={bulkSelectMode}
          bulkStatus={status}
          selectedAnswerIds={selectedAnswerIds}
          setSelectedAnswerIds={setSelectedAnswerIds}
        />
      ))}
    </>
  )
}
