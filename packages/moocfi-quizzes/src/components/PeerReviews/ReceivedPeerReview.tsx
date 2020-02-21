import * as React from "react"
import { useContext } from "react"
import styled from "styled-components"
import ThemeProviderContext from "../../contexes/themeProviderContext"
import { Paper } from "@material-ui/core"
import {
  PeerReviewQuestionAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
  PeerReviewQuestion,
  IReceivedPeerReview,
} from "../../modelTypes"
import MarkdownText from "../MarkdownText"
import {
  WhiteSpacePreservingTypography,
  SpaciousPaper,
} from "../styleComponents"
import LikertScale from "likert-react"
import { BoldTypography, withMargin } from "../styleComponents"
import { ReceivedPeerReviewLabels } from "../../utils/languages/"

interface AnswerPaperProps {
  providedStyles?: string | undefined
}

const AnswerPaper = styled(SpaciousPaper)<AnswerPaperProps>`
  ${({ providedStyles }) => providedStyles}
`
interface IReceivedPeerReviewProps {
  questions: PeerReviewQuestion[]
  answer: IReceivedPeerReview
  idx: number
  receivedReviewsLabels: ReceivedPeerReviewLabels
}

const ReceivedPeerReview: React.FunctionComponent<IReceivedPeerReviewProps> = ({
  questions,
  answer,
  idx,
  receivedReviewsLabels,
}) => {
  const themeProvider = useContext(ThemeProviderContext)

  if (typeof answer.createdAt === "string") {
    answer.createdAt = new Date(answer.createdAt)
  }

  const Title = withMargin(BoldTypography, "0 0 0.5rem !important")

  return (
    <AnswerPaper elevation={4} providedStyles={themeProvider.answerPaperStyles}>
      <Title>
        {receivedReviewsLabels.peerReviewLabel} {idx + 1} (
        {answer.createdAt.toLocaleDateString()})
      </Title>
      {questions
        .sort((e1, e2) => e1.order - e2.order)
        .map(question => {
          const questionAnswer = answer.answers.find(
            a => a.peerReviewQuestionId === question.id,
          )
          if (!questionAnswer) {
            return <div />
          }

          return (
            <div key={question.id}>
              <PeerReviewQuestionAnswer
                questionAnswer={questionAnswer}
                questionTitle={question.texts[0].title}
                questionBody={question.texts[0].body}
              />
            </div>
          )
        })}
    </AnswerPaper>
  )
}

interface IReceivedPeerReviewQuestionAnswer {
  questionAnswer: PeerReviewQuestionAnswer
  questionTitle: string
  questionBody: string
}

const PeerReviewQuestionAnswer: React.FunctionComponent<
  IReceivedPeerReviewQuestionAnswer
> = ({ questionAnswer, questionTitle }) => {
  const answerType =
    typeof (questionAnswer as PeerReviewEssayAnswer).text === "string"
      ? "essay"
      : "grade"

  let Component: React.ReactElement

  switch (answerType) {
    case "essay":
      Component = (
        <ReceivedEssayAnswer
          questionAnswer={questionAnswer as PeerReviewEssayAnswer}
          questionTitle={questionTitle}
        />
      )
      break
    case "grade":
      Component = (
        <ReceivedGradeAnswer
          questionAnswer={questionAnswer as PeerReviewGradeAnswer}
          questionTitle={questionTitle}
        />
      )
      break
    default:
      Component = (
        <div>
          No support for this type of peer review question type: {answerType}
        </div>
      )
  }
  return <div>{Component}</div>
}

interface IReceivedPeerReviewEssayAnswer {
  questionAnswer: PeerReviewEssayAnswer
  questionTitle: string
  questionBody?: string
}

interface IReceivedPeerReviewGradeAnswer {
  questionAnswer: PeerReviewGradeAnswer
  questionTitle: string
  questionBody?: string
}

const ReceivedEssayAnswer: React.FunctionComponent<
  IReceivedPeerReviewEssayAnswer
> = ({ questionTitle, questionAnswer }) => (
  <div style={{ paddingRight: "1.5rem", marginTop: "1rem" }}>
    <MarkdownText>{questionTitle}</MarkdownText>
    <AnswerPaper>
      <WhiteSpacePreservingTypography variant="body1">
        {questionAnswer.text}
      </WhiteSpacePreservingTypography>
    </AnswerPaper>
  </div>
)

const ReceivedGradeAnswer: React.FunctionComponent<
  IReceivedPeerReviewGradeAnswer
> = ({ questionTitle, questionAnswer }) => (
  <LikertScale
    key={questionAnswer.peerReviewQuestionId}
    reviews={[{ question: questionTitle, review: questionAnswer.value }]}
    highlightColor="#3262c9"
    frozen
  />
)

export default ReceivedPeerReview
