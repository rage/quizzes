import * as React from "react"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { useTypedSelector } from "../../state/store"
import { QuizAnswer } from "../../state/quizAnswer/reducer"
import { SpaciousPaper } from "../styleComponents"

type PeerReviewOptionProps = {
  answer: QuizAnswer
}

const PeerReviewOption: React.FunctionComponent<PeerReviewOptionProps> = ({
  answer,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  const quizItems = quiz.items

  const quizItemById = id => quizItems.find(qi => qi.id === id)

  return (
    <>
      {answer.itemAnswers
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
              <Typography variant="subtitle2">
                {quizItem.texts[0].title}
              </Typography>
              <SpaciousPaper key={ia.id}>
                <Typography variant="body1">{ia.textData}</Typography>
              </SpaciousPaper>
            </React.Fragment>
          )
        })}
    </>
  )
}

export default PeerReviewOption
