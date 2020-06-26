import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { EditableQuiz } from "../../../types/EditQuiz"
import { initializedEditor } from "../../../store/editor/editorActions"
import { useDispatch } from "react-redux"
import BasicInfo from "../../../components/QuizEditForms/BasicInfo"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import SaveButton from "../../../components/SaveButton"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"
import QuizItems from "../../../components/QuizEditForms/QuizItems"
import useSWR from "swr"
import { withRouter } from "next/router"
import { Skeleton } from "@material-ui/lab"

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`
const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const EditPage = ({ router }: any) => {
  const id = router.query.id
  const { data, error } = useSWR(id, fetchQuiz)
  const dispatch = useDispatch()
  if (error) {
    return <div>Something went wrong</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="text" width={900} height={50} />
        <StyledSkeleton variant="rect" width={900} height={400} />
        <StyledSkeleton variant="rect" width={900} height={400} />
      </>
    )
  }
  const quiz = data
  const storeState = normalize(quiz, normalizedQuiz)
  const normalizedData = {
    quizzes: storeState.entities.quizzes ?? {},
    items: storeState.entities.items ?? {},
    options: storeState.entities.options ?? {},
    result: storeState.result,
  }
  dispatch(initializedEditor(normalizedData))

  return (
    <>
      <SaveButton />
      <Typography variant="h3">Editing quiz</Typography>
      <StyledId>{id}</StyledId>
      <BasicInfo />
      <QuizItems />
    </>
  )
}

export default withRouter(EditPage)
