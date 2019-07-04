import * as React from "react"
import Typography from "@material-ui/core/Typography"
import { useTypedSelector } from "../../state/store"
import { SpaciousPaper } from "../styleComponents"
import { QuizAnswer } from "../../modelTypes"

type PeerReviewOptionProps = {
  answer: QuizAnswer
}

const PeerReviewOption: React.FunctionComponent<PeerReviewOptionProps> = ({
  answer,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  if (!quiz) {
    return <div />
  }
  const quizItems = quiz.items

  const quizItemById = (id: string) => quizItems.find(qi => qi.id === id)

  return (
    <>
      {answer.itemAnswers
        .filter(ia => {
          const item = quizItemById(ia.quizItemId)
          return !item || item.type === "essay"
        })
        .sort((ia1, ia2) => {
          const qi1 = quizItemById(ia1.quizItemId)
          const qi2 = quizItemById(ia2.quizItemId)
          if (!qi1 || !qi2) {
            return -1
          }
          return qi1.order - qi2.order
        })
        .map(ia => {
          const quizItem = quizItemById(ia.quizItemId)
          const quizTitle = quizItem ? quizItem.texts[0].title : ""

          return (
            <React.Fragment key={ia.id}>
              <Typography variant="subtitle2">{quizTitle}</Typography>
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
