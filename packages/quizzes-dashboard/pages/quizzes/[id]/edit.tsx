import React from "react"
import { fetchQuiz } from "../../../services/quizzes"
import CheckBoxQuizEditForm from "../../../components/QuizEditForms/CheckBoxQuiz"
import EssayQuizEditForm from "../../../components/QuizEditForms/EssayQuiz"
import { EditableQuiz } from "../../../types/EditQuiz"
import { get } from "lodash"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz
}

const ShowQuizPage = ({ quiz, id }: ShowQuizPageProps) => {
  const type = get(quiz, "items[0].type")

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

export default ShowQuizPage

ShowQuizPage.getInitialProps = async (ctx: any) => {
  const id: string = ctx.query.id.toString()
  const quiz = await fetchQuiz(id)
  return {
    id,
    quiz,
  }
}
