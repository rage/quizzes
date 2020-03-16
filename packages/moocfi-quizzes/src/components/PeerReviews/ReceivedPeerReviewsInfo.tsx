import * as React from "react"
import styled from "styled-components"
import { Button, Typography } from "@material-ui/core"
import {
  PeerReviewGradeAnswer,
  IReceivedPeerReview,
  PeerReviewQuestion,
} from "../../modelTypes"
import { useTypedSelector } from "../../state/store"
import { useDispatch } from "react-redux"
import { requestReviews } from "../../state/receivedReviews/actions"
import ReceivedPeerReview from "./ReceivedPeerReview"
import { BaseButton, BoldTypography } from "../styleComponents"
import { ReceivedPeerReviewLabels } from "../../utils/languages/"

const ToggleButton = styled(BaseButton)<{ expanded: boolean }>`
  ${props => props.expanded && "margin-top: 0.5rem;"}
`

const ReceivedPeerReviews: React.FunctionComponent<any> = () => {
  const [expanded, setExpanded] = React.useState(false)
  const dispatch = useDispatch()

  const receivedReviews = useTypedSelector(
    state => state.receivedReviews.reviews,
  )
  const loadingState = useTypedSelector(
    state => state.receivedReviews.loadingState,
  )
  const quiz = useTypedSelector(state => state.quiz)
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )

  if (!quiz) {
    return <div>Quiz somehow not set. Try reloading the page</div>
  }

  if (!languageLabels) {
    return <div>Language not set (should set to English then)</div>
  }
  const receivedReviewsLabels = languageLabels.receivedPeerReviews

  React.useEffect(() => {
    dispatch(requestReviews())
  }, [])

  const peerReviewQuestions = quiz.peerReviewCollections[0].questions

  if (
    loadingState === "loading" ||
    (loadingState === "began" && receivedReviews.length < 1)
  ) {
    return <div>{receivedReviewsLabels.loadingLabel}</div>
  }

  if (loadingState === "error") {
    return <div>{receivedReviewsLabels.errorLabel}</div>
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <ReceivedReviewsSummary
        peerReviews={receivedReviews}
        peerReviewQuestions={peerReviewQuestions}
        receivedReviewsLabels={receivedReviewsLabels}
      />
      {receivedReviews.length > 0 && (
        <ToggleButton
          variant="outlined"
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? receivedReviewsLabels.toggleButtonShrinkLabel
            : receivedReviewsLabels.toggleButtonExpandLabel}
        </ToggleButton>
      )}
      {expanded && (
        <ReceivedReviewsDetailed
          peerReviews={receivedReviews}
          peerReviewQuestions={peerReviewQuestions}
          receivedReviewsLabels={receivedReviewsLabels}
        />
      )}
    </div>
  )
}

interface IReceivedReviewsProps {
  peerReviews: IReceivedPeerReview[]
  peerReviewQuestions: PeerReviewQuestion[]
  receivedReviewsLabels: ReceivedPeerReviewLabels
}

const ReceivedReviewsDetailed: React.FunctionComponent<IReceivedReviewsProps> = ({
  peerReviews,
  peerReviewQuestions,
  receivedReviewsLabels,
}) => {
  return (
    <div style={{ marginTop: 20 }}>
      {peerReviews
        .sort(
          (rev1, rev2) => rev2.createdAt.getTime() - rev1.createdAt.getTime(),
        )
        .map((pr, idx) => (
          <ReceivedPeerReview
            questions={peerReviewQuestions}
            answer={pr}
            idx={idx}
            receivedReviewsLabels={receivedReviewsLabels}
          />
        ))}
    </div>
  )
}

const ReceivedReviewsSummary: React.FunctionComponent<IReceivedReviewsProps> = ({
  peerReviews,
  receivedReviewsLabels,
}) => {
  const gradeAnswers = peerReviews.flatMap(review =>
    review.answers
      .filter(a => typeof (a as PeerReviewGradeAnswer).value === "number")
      .map(prqa => (prqa as PeerReviewGradeAnswer).value!),
  )

  let average: number | string = "-"
  if (gradeAnswers.length > 0) {
    average = gradeAnswers.reduce((sum, e) => (sum += e)) / gradeAnswers.length
    average = average.toFixed(2)
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      <BoldTypography>{receivedReviewsLabels.summaryViewLabel}</BoldTypography>
      {peerReviews.length === 0 ? (
        <Typography variant="subtitle1">
          {receivedReviewsLabels.noPeerReviewsReceivedlabel}
        </Typography>
      ) : (
        <Typography>
          {receivedReviewsLabels.numberOfPeerReviewsText(peerReviews.length)}{" "}
          {receivedReviewsLabels.averageOfGradesLabel} {average + "."}
        </Typography>
      )}
    </div>
  )
}

export default ReceivedPeerReviews
