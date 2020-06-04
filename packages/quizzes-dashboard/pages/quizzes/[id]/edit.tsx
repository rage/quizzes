import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import { EditableQuiz } from "../../../types/EditQuiz"
import { get } from "lodash"
import { initializedEditor } from "../../../store/edit/actions"
import { connect } from "react-redux"
import BasicInfo from "../../../components/QuizEditForms/BasicInfo"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import QuizItem from "../../../components/QuizEditForms/QuizItem"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
  editableQuiz: (quiz: EditableQuiz) => any
}

const StyledId = styled(Typography)`
  margin-bottom: 1rem !important;
`

const ShowQuizPage = ({ quiz, id, editableQuiz }: ShowQuizPageProps) => {
  editableQuiz(quiz)
  return (
    <>
      <Typography variant="h3">Editing quiz</Typography>
      <StyledId>{id}</StyledId>
      <BasicInfo />

      {quiz.items.map(item => {
        return (
          <>
            <QuizItem key={item.id} item={item} />
          </>
        )
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

const mapDispatchToProps = (dispatch: any, quiz: EditableQuiz) => {
  return {
    editableQuiz: () => dispatch(initializedEditor(quiz)),
  }
}

export default connect(null, mapDispatchToProps)(ShowQuizPage)
