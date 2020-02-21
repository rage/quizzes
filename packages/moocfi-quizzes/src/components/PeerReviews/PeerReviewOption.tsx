import * as React from "react"
import { useContext } from "react"
import styled from "styled-components"
import ThemeProviderContext from "../../contexes/themeProviderContext"
import Typography from "@material-ui/core/Typography"
import { useTypedSelector } from "../../state/store"
import {
  SpaciousPaper,
  WhiteSpacePreservingTypography,
} from "../styleComponents"
import { QuizAnswer } from "../../modelTypes"

interface AnswerPaperProps {
  providedStyles: string | undefined
}

const AnswerPaper = styled(SpaciousPaper)<AnswerPaperProps>`
  ${({ providedStyles }) => providedStyles}
`

type PeerReviewOptionProps = {
  answer: QuizAnswer
}

const PeerReviewOption: React.FunctionComponent<PeerReviewOptionProps> = ({
  answer,
}) => {
  const themeProvider = useContext(ThemeProviderContext)

  const quiz = useTypedSelector(state => state.quiz)
  if (!quiz) {
    return <div />
  }
  const quizItems = quiz.items

  const quizItemById = (id: string) => quizItems.find(qi => qi.id === id)

  return (
    <div style={{ padding: ".5rem 1rem" }}>
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
              <Typography component="p" variant="subtitle2">
                {quizTitle}
              </Typography>
              <AnswerPaper
                key={ia.id}
                providedStyles={themeProvider.answerPaperStyles}
              >
                <WhiteSpacePreservingTypography variant="body1">
                  {ia.textData}
                </WhiteSpacePreservingTypography>
              </AnswerPaper>
            </React.Fragment>
          )
        })}
    </div>
  )
}

export default PeerReviewOption
