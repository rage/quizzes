import React from "react"
import styled from "styled-components"
import QuizItems from "./QuizItems"
import BasicInfo from "./BasicInfo"
import { useTypedSelector } from "../../store/store"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../DebugDialog"
import useBeforeUnload from "../../hooks/useBeforeUnload"
import { Divider } from "@material-ui/core"
import { PeerReviewEditForms } from "./PeerReviewEditForms"

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
  const quizId = useTypedSelector(state => state.editor.quizId)
  const changes = useTypedSelector(state => state.editor.editorChanges.changes)
  useBeforeUnload((e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = ""
  }, changes)

  if (!quizId) {
    return (
      <>
        <StyledSkeleton variant="text" width={900} height={200} />
        <StyledSkeleton variant="rect" width={900} height={400} />
        <StyledSkeleton variant="rect" width={900} height={400} />
      </>
    )
  }
  return (
    <>
      <BasicInfo />
      <QuizItems />
      <StyledDivider />
      <PeerReviewEditForms />
      <DebugDialog />
    </>
  )
}

export default QuizEditForms
