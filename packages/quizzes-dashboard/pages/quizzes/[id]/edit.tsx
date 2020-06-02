import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import CheckBoxQuizEditForm from "../../../components/QuizEditForms/CheckBoxQuiz"
import EssayQuizEditForm from "../../../components/QuizEditForms/EssayQuiz"
import { EditableQuiz } from "../../../types/EditQuiz"
import { get } from "lodash"
import { initializedEditor } from "../../../store/edit/actions"
import { connect } from "react-redux"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
  editableQuiz: (quiz: EditableQuiz) => any
}

const ShowQuizPage = ({ quiz, id, editableQuiz }: ShowQuizPageProps) => {
  const type = get(quiz, "items[0].type")
  editableQuiz(quiz)

  switch (type) {
    case "checkbox": {
      return (
        <>
          <CheckBoxQuizEditForm />
        </>
      )
    }
    default: {
      return (
        <>
          <EssayQuizEditForm />
        </>
      )
    }
  }
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

export default connect(
  null,
  mapDispatchToProps,
)(ShowQuizPage)
