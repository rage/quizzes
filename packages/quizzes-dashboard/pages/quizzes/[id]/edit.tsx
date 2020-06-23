import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { EditableQuiz } from "../../../types/EditQuiz"
import { initializedEditor } from "../../../store/edit/editActions"
import { useDispatch } from "react-redux"
import BasicInfo from "../../../components/QuizEditForms/BasicInfo"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import QuizItem from "../../../components/QuizEditForms/QuizItem"
import SaveButton from "../../../components/SaveButton"
import { normalizedQuiz } from "../../../schemas"
import { normalize } from "normalizr"
import { useTypedSelector } from "../../../store/store"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
}

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const ShowQuizPage = ({ quiz, id }: ShowQuizPageProps) => {
  const dispatch = useDispatch()
  const storeState = normalize(quiz, normalizedQuiz)
  console.log(storeState)
  dispatch(initializedEditor(storeState))

  const storeItems = Object.values(
    useTypedSelector(state => state.editor.items),
  )

  return (
    <>
      {/* <SaveButton /> */}
      <Typography variant="h3">Editing quiz</Typography>
      <StyledId>{id}</StyledId>
      <BasicInfo />

      {storeItems.map(item => {
        return <QuizItem key={item.id} item={item} />
      })}
    </>
  )
}

ShowQuizPage.getInitialProps = async (ctx: any) => {
  const id: string = ctx.query.id.toString()
  const quiz = await fetchQuiz(id)
  return {
    id,
    quiz,
  }
}

export default ShowQuizPage
