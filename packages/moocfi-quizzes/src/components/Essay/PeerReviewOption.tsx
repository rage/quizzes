import * as React from "react"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { useTypedSelector } from "../../state/store"

const paper = {
  padding: 10,
  margin: 10,
}

type PeerReviewOptionProps = {
  answer: any
}

export default ({ answer }) => {
  const quiz = useTypedSelector(state => state.quiz)
  const quizItems = quiz.items

  const quizItemById = id => quizItems.find(qi => qi.id === id)

  return answer.itemAnswers
    .filter(ia => {
      return quizItemById(ia.quizItemId).type === "essay"
    })
    .sort((ia1, ia2) => {
      const qi1 = quizItemById(ia1.quizItemId)
      const qi2 = quizItemById(ia2.quizItemId)
      return qi1.order - qi2.order
    })
    .map(ia => {
      const quizItem = quizItemById(ia.quizItemId)

      return (
        <React.Fragment key={ia.id}>
          <Typography variant="subtitle2">{quizItem.texts[0].title}</Typography>
          <Paper style={paper} key={ia.id}>
            <Typography variant="body1">{ia.textData}</Typography>
          </Paper>
        </React.Fragment>
      )
    })
}
