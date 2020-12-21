import React, { useEffect, useState } from "react"
import { Checkbox } from "@material-ui/core"

import { Answer } from "../../types/Answer"
import { Card } from "@material-ui/core"
import styled from "styled-components"
import { AnswerContent } from "./CardContent"
import { editableAnswerStates } from "./constants"
import {
  setBulkSelectedIds,
  useAnswerListState,
} from "../../contexts/AnswerListContext"

interface AdditionalAnswerCardProps {
  faded: boolean
  status: string
}

const AnswerCardWrapper = styled.div`
  display: flex;
  .PrivateSwitchBase-root-5 {
    &:hover {
      background: transparent !important;
    }
  }

  .custom-checkbox-root .MuiSvgIcon-root {
    width: 2rem;
    height: 2rem;
    margin-right: 2rem;
  }

  @media (max-width: 480px) {
    .custom-checkbox-root .MuiSvgIcon-root {
      width: 1rem;
      height: 1rem;
      margin-right: 0;
    }

    flex-direction: column-reverse;
  }
`

export const StyledAnswerCard = styled(Card)<AdditionalAnswerCardProps>`
  display: flex;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  padding: 2.5rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 7px 0px,
    rgba(0, 0, 0, 0.15) 0px 3px 6px -2px, rgba(0, 0, 0, 0.25) 0px 1px 10px 0px !important;
  background-color: ${props => {
    let rgba = "0, 0, 0, 0.3"
    if (props.status === "confirmed") {
      rgba = "76, 175, 80, 0.2"
    }
    if (props.status === "rejected") {
      rgba = "244, 67, 54, 0.2"
    }
    return props.faded && `rgba(${rgba}) !important;`
  }};
`

export interface AnswerProps {
  answer: Answer
}

export const AnswerCard = ({ answer }: AnswerProps) => {
  const [faded, setFaded] = useState(false)
  const [statusChange, setStatusChange] = useState("")
  const [checked, setChecked] = useState(false)
  const [
    { bulkSelectMode, bulkSelectedIds, handledAnswers },
    dispatch,
  ] = useAnswerListState()

  useEffect(() => {
    setChecked(bulkSelectedIds.includes(answer.id))
    handledAnswers.forEach(a => {
      if (a.id === answer.id) {
        setStatusChange(a.status)
        setFaded(true)
        return
      }
    })
  }, [handledAnswers, bulkSelectedIds, bulkSelectMode])

  const handleAnswerSelection = () => {
    let updatedIds = []

    if (bulkSelectedIds?.includes(answer.id)) {
      updatedIds = bulkSelectedIds.filter((id: string) => id !== answer.id)
    } else {
      updatedIds = [...(bulkSelectedIds || []), answer.id]
    }

    dispatch(setBulkSelectedIds(updatedIds))

    setChecked(!checked)
  }

  const bulkSelectedAndStatusEditable =
    bulkSelectMode && editableAnswerStates.includes(answer.status)

  return (
    <AnswerCardWrapper>
      {bulkSelectedAndStatusEditable && (
        <Checkbox
          classes={{ root: "custom-checkbox-root" }}
          color="primary"
          checked={checked}
          onChange={handleAnswerSelection}
          inputProps={{ "aria-label": "Select answer" }}
        />
      )}
      <StyledAnswerCard faded={faded} status={statusChange}>
        <AnswerContent answer={answer} />
      </StyledAnswerCard>
    </AnswerCardWrapper>
  )
}

export default AnswerCard
