import * as React from "react"
import { Button, Typography, List, ListItem } from "@material-ui/core"
import {
  PeerReviewAnswer,
  PeerReviewQuestionAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
  IReceivedPeerReview,
  PeerReviewQuestion,
} from "../../modelTypes"
import { useTypedSelector } from "../../state/store"
import { useDispatch } from "react-redux"
import { languageOptions } from "../../utils/languages"
import { requestReviews } from "../../state/receivedReviews/actions"
import { peerReviewsReducer } from "../../state/peerReviews/reducer"
import ReceivedPeerReview from "./ReceivedPeerReview"

const ReceivedPeerReviews: React.FunctionComponent<any> = () => {
  const [modalOpened, setModalOpened] = React.useState(false)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(requestReviews())
  }, [])

  const receivedReviews = useTypedSelector(
    state => state.receivedReviews.reviews,
  )
  const loadingState = useTypedSelector(
    state => state.receivedReviews.loadingState,
  )

  const quiz = useTypedSelector(state => state.quiz)
  if (!quiz) return <div>ye</div>

  const peerReviewQuestions = quiz.peerReviewCollections[0].questions

  if (
    loadingState === "loading" ||
    (loadingState === "began" && receivedReviews.length < 1)
  ) {
    return <div>Loading...</div>
  }

  if (loadingState === "error") {
    return <div>Something odd occurred. Try reloading</div>
  }

  const toggleButton = (
    <Button variant="outlined" onClick={() => setModalOpened(!modalOpened)}>
      {modalOpened
        ? "Show less peer review information"
        : "Show all the received peer reviews"}
    </Button>
  )

  return (
    <>
      {modalOpened && toggleButton}
      {modalOpened ? (
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
      <h2>Details of all the reviews</h2>
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
      .map(prqa => prqa.value),
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
        Your answered has received {peerReviews.length} reviews. The average of
        all grades is {average}.
      </Typography>
    </div>
  )
}

export default ReceivedPeerReviews
