import React from "react"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import QuizItems from "./QuizItems"
import BasicInfo from "./BasicInfo"
import { useTypedSelector } from "../../store/store"
import { Skeleton } from "@material-ui/lab"
import DebugDialog from "../DebugDialog"
import useBeforeUnload from "../../hooks/useBeforeUnload"

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
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
      <DebugDialog />
    </>
  )
}

export default QuizEditForms
