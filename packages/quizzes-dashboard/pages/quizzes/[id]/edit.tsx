import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import CheckBoxQuizEditForm from "../../../components/QuizEditForms/CheckBoxQuiz"
import EssayQuizEditForm from "../../../components/QuizEditForms/EssayQuiz"
import { EditableQuiz } from "../../../types/EditQuiz"
import { get } from "lodash"
import { initializedQuiz } from "../../../store/edit/actions"
import { connect } from "react-redux"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
  initialQuiz: (quiz: EditableQuiz) => any
}

const ShowQuizPage = ({ quiz, id, initialQuiz }: ShowQuizPageProps) => {
  const type = get(quiz, "items[0].type")
  initialQuiz(quiz)

  switch (type) {
    case "checkbox": {
      return (
        <>
          <CheckBoxQuizEditForm quiz={quiz} id={id} />
        </>
      )
    }
    default: {
      return (
        <>
          <EssayQuizEditForm quiz={quiz} id={id} />
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
    initialQuiz: () => dispatch(initializedQuiz(quiz)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(ShowQuizPage)
