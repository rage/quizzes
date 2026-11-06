import React from "react"

import styled from "styled-components"

import { Skeleton } from "@mui/material"
import { Divider } from "@mui/material"

import useBeforeUnload from "../../hooks/useBeforeUnload"
import { useTypedSelector } from "../../store/store"
import DebugDialog from "../DebugDialog"
import BasicInfo from "./BasicInfo"
import { PeerReviewEditForms } from "./PeerReviewEditForms"
import QuizItems from "./QuizItems"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`
const StyledDivider = styled(Divider)`
  display: flex !important;
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  width: 100% !important;
`

const QuizEditForms = () => {
  const quizId = useTypedSelector((state) => state.editor.quizId)
  const changes = useTypedSelector(
    (state) => state.editor.editorChanges.changes,
  )
  useBeforeUnload((e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = ""
  }, changes)

  if (!quizId) {
    return (
      <>
        <StyledSkeleton variant="text" width={900} height={200} />
        <StyledSkeleton variant="rectangular" width={900} height={400} />
        <StyledSkeleton variant="rectangular" width={900} height={400} />
      </>
    )
  }
  return (
    <>
      <BasicInfo key={quizId} />
      <QuizItems />
      <StyledDivider />
      <PeerReviewEditForms />
      <DebugDialog />
    </>
  )
}

export default QuizEditForms
