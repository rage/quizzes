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
import { QuizAnswer, QuizItemOption } from "../../modelTypes"
import MarkdownText from "../MarkdownText"

interface AnswerPaperProps {
  providedStyles: string | undefined
}

const AnswerPaper = styled(SpaciousPaper)<AnswerPaperProps>`
  margin-bottom: 2rem;
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
          return quizItemById(ia.quizItemId)
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
          const quizTitle = quizItem ? quizItem.title : ""
          let chosenOptions = null

          if (ia.optionAnswers && ia.optionAnswers.length > 0) {
            const selectedQuizOptionIds = ia.optionAnswers.map(
              oa => oa.quizOptionId,
            )
            const selectedOptions = quizItem?.options?.filter(option =>
              selectedQuizOptionIds.includes(option.id),
            )
            if (selectedOptions && selectedOptions.length > 0) {
              chosenOptions = selectedOptions.map(o => o.title).join(", ")
            }
          }

          return (
            <React.Fragment key={ia.id}>
              <MarkdownText>{quizTitle}</MarkdownText>
              <AnswerPaper
                key={ia.id}
                providedStyles={themeProvider.answerPaperStyles}
              >
                {chosenOptions && (
                  <WhiteSpacePreservingTypography variant="body1">
                    {chosenOptions}
                  </WhiteSpacePreservingTypography>
                )}
                {ia.textData && (
                  <WhiteSpacePreservingTypography variant="body1">
                    {ia.textData}
                  </WhiteSpacePreservingTypography>
                )}
              </AnswerPaper>
            </React.Fragment>
          )
        })}
    </div>
  )
}

export default PeerReviewOption
