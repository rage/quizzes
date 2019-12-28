import React from "react"
import { fetchQuiz } from "../../../services/quizzes"

import { get, groupBy } from "lodash"
import { Typography, Card, CardContent } from "@material-ui/core"
import DebugDialog from "../../../components/DebugDialog"
import styled from "styled-components"
import { EditableQuiz } from "../../../types/EditQuiz"

interface ShowQuizPageProps {
  id: string
  quiz: EditableQuiz[]
}

const ShowQuizPage = ({ quiz, id }: ShowQuizPageProps) => {
  const name = get(quiz, "texts[0].title") || `Unknown quiz ${id}`
  return (
    <>
      <Typography variant="h3">Edit {name}</Typography>
      <DebugDialog editable data={quiz} />
    </>
  )
}

export default ShowQuizPage

ShowQuizPage.getInitialProps = async (ctx: any) => {
  // TODO: ideally this should fetch course details, not quiz details
  const id: string = ctx.query.id.toString()
  const quiz = await fetchQuiz(id)
  return {
    id,
    quiz,
  }
}
