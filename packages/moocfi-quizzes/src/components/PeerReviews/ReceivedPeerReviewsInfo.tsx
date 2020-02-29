import * as React from "react"
import styled from "styled-components"
import { Button, CircularProgress, Typography } from "@material-ui/core"
import {
  PeerReviewGradeAnswer,
  IReceivedPeerReview,
  PeerReviewQuestion,
} from "../../modelTypes"
import { useTypedSelector } from "../../state/store"
import { useDispatch } from "react-redux"
import { requestReviews } from "../../state/receivedReviews/actions"
import ReceivedPeerReview from "./ReceivedPeerReview"
import {
  BaseButton,
  BoldTypography,
  TopMarginDivSmall,
  TopMarginDivLarge,
  withMargin,
} from "../styleComponents"
import { ReceivedPeerReviewLabels } from "../../utils/languages/"

import Togglable from "../../utils/Togglable"
import Notification from "../Notification"

const ToggleButton = styled(BaseButton)<{ expanded: boolean }>`
  ${props => props.expanded && "margin-top: 0.5rem;"}
`

const ReceivedPeerReviews: React.FunctionComponent<any> = () => {
  const [expanded, setExpanded] = React.useState(false)
  const dispatch = useDispatch()

  const receivedReviews = useTypedSelector(
    state => state.receivedReviews.reviews,
  )
  const error = useTypedSelector(state => state.message.error)
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

  if (!receivedReviews) {
    return (
      <div>
        {error ? (
          <div />
        ) : (
          <>
            <CircularProgress size={25} />
            <Typography>{receivedReviewsLabels.loadingLabel}</Typography>
          </>
        )}
      </div>
    )
  }

  return (
    <TopMarginDivLarge>
      <ReceivedReviewsSummary
        peerReviews={receivedReviews}
        peerReviewQuestions={peerReviewQuestions}
        receivedReviewsLabels={receivedReviewsLabels}
      />
      {receivedReviews.length > 0 && (
        <Togglable
          initiallyVisible={false}
          hideButtonText={receivedReviewsLabels.toggleButtonShrinkLabel}
          displayButtonText={receivedReviewsLabels.toggleButtonExpandLabel}
          scrollRef={null}
        >
          <ReceivedReviewsDetailed
            peerReviews={receivedReviews}
            peerReviewQuestions={peerReviewQuestions}
            receivedReviewsLabels={receivedReviewsLabels}
          />
        </Togglable>
      )}
    </TopMarginDivLarge>
  )
}

interface IReceivedReviewsProps {
  peerReviews: IReceivedPeerReview[]
  peerReviewQuestions: PeerReviewQuestion[]
  receivedReviewsLabels: ReceivedPeerReviewLabels
}

const ReceivedReviewsDetailed: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews, peerReviewQuestions, receivedReviewsLabels }) => {
  return (
    <div style={{ marginTop: 20 }}>
      {peerReviews
        .sort(
          (rev1, rev2) => rev2.createdAt.getTime() - rev1.createdAt.getTime(),
        )
        .map((pr, idx) => (
          <ReceivedPeerReview
            key={pr.id}
            questions={peerReviewQuestions}
            answer={pr}
            idx={idx}
            receivedReviewsLabels={receivedReviewsLabels}
          />
        ))}
    </div>
  )
}

const ReceivedReviewsSummary: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews, receivedReviewsLabels }) => {
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

  const Title = withMargin(BoldTypography, "1rem 0 0")
  const Body = withMargin(Typography, "0.5rem 0 0")

  return (
    <div>
      <Title>{receivedReviewsLabels.summaryViewLabel}</Title>
      {peerReviews.length === 0 ? (
        <Body component="p" variant="subtitle1">
          {receivedReviewsLabels.noPeerReviewsReceivedlabel}
        </Body>
      ) : (
        <Body>
          {receivedReviewsLabels.numberOfPeerReviewsText(peerReviews.length)}{" "}
          {receivedReviewsLabels.averageOfGradesLabel} {average + "."}
        </Body>
      )}
    </div>
  )
}

export default ReceivedPeerReviews
