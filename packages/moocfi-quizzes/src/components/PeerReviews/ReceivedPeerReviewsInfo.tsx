import * as React from "react"
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

  if (receivedReviews.length === 0) {
    return (
      <Typography variant="subtitle1">
        {receivedReviewsLabels.noPeerReviewsReceivedlabel}
      </Typography>
    )
  }

  const toggleButton = (
    <Button variant="outlined" onClick={() => setExpanded(!expanded)}>
      {expanded
        ? receivedReviewsLabels.toggleButtonShrinkLabel
        : receivedReviewsLabels.toggleButtonExpandLabel}
    </Button>
  )

  return (
    <>
      {expanded && toggleButton}
      {expanded ? (
        <ReceivedReviewsDetailed
          peerReviews={receivedReviews}
          peerReviewQuestions={peerReviewQuestions}
        />
      ) : (
        <ReceivedReviewsSummary
          peerReviews={receivedReviews}
          peerReviewQuestions={peerReviewQuestions}
        />
      )}
      {toggleButton}
    </>
  )
}

interface IReceivedReviewsProps {
  peerReviews: IReceivedPeerReview[]
  peerReviewQuestions: PeerReviewQuestion[]
}

const ReceivedReviewsDetailed: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews, peerReviewQuestions }) => {
  return (
    <div>
      <h2>{}Details of all the reviews</h2>
      {peerReviews
        .sort(
          (rev1, rev2) => rev2.createdAt.getTime() - rev1.createdAt.getTime(),
        )
        .map((pr, idx) => (
          <ReceivedPeerReview
            questions={peerReviewQuestions}
            answer={pr}
            idx={idx}
          />
        ))}
    </div>
  )
}

const ReceivedReviewsSummary: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews }) => {
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
      <h2>Overview of the reviews</h2>

      <Typography>
        Your answer has received {peerReviews.length} reviews. The average of
        all grades is {average}.
      </Typography>
    </div>
  )
}

export default ReceivedPeerReviews
