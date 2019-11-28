import * as React from "react"
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core"
import {
  PeerReviewQuestionAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
  PeerReviewQuestion,
  IReceivedPeerReview,
} from "../../modelTypes"

interface IReceivedPeerReviewProps {
  questions: PeerReviewQuestion[]
  answer: IReceivedPeerReview
}

const ReceivedPeerReview: React.FunctionComponent<IReceivedPeerReviewProps> = ({
  questions,
  answer,
}) => {
  console.log("Questions: ", questions)

  return (
    <div>
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
    </div>
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
  if (typeof (questionAnswer as PeerReviewEssayAnswer).text === "string") {
    questionAnswer = questionAnswer as PeerReviewEssayAnswer
    return (
      <React.Fragment>
        <Typography variant="subtitle1">{questionTitle}</Typography>
        <Typography variant="body1" style={{ wordBreak: "break-word" }}>
          {questionAnswer.text}
        </Typography>
      </React.Fragment>
    )
  } else {
    questionAnswer = questionAnswer as PeerReviewGradeAnswer
    return (
      <FormControl fullWidth={true}>
        <FormLabel>{questionTitle}</FormLabel>
        <RadioGroup value={`${questionAnswer.value}`} row={true}>
          {[1, 2, 3, 4, 5].map(n => {
            return (
              <FormControlLabel
                key={"radio" + n}
                value={`${n}`}
                label={n}
                labelPlacement="start"
                control={<Radio color="primary" disabled={true} />}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
    )
  }
}

export default ReceivedPeerReview
