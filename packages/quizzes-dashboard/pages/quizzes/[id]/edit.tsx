import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { EditableQuiz } from "../../../types/EditQuiz"
import { initializedEditor } from "../../../store/edit/editActions"
import { useDispatch } from "react-redux"
import BasicInfo from "../../../components/QuizEditForms/BasicInfo"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import SaveButton from "../../../components/SaveButton"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"
import QuizItems from "../../../components/QuizEditForms/QuizItems"

interface EditPageProps {
  id: string
  quiz: EditableQuiz
}

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const EditPage = ({ quiz, id }: EditPageProps) => {
  const dispatch = useDispatch()
  const storeState = normalize(quiz, normalizedQuiz)
  dispatch(initializedEditor(storeState))

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

EditPage.getInitialProps = async (ctx: any) => {
  const id: string = ctx.query.id.toString()
  const quiz = await fetchQuiz(id)
  return {
    id,
    quiz,
  }
}

export default EditPage
