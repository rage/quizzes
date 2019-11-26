import * as React from "react"
import { Button, Typography } from "@material-ui/core"
import {
  PeerReviewAnswer,
  PeerReviewQuestionAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
  IReceivedPeerReview,
} from "../../modelTypes"
import { useTypedSelector } from "../../state/store"
import { useDispatch } from "react-redux"
import { languageOptions } from "../../utils/languages"
import { requestReviews } from "../../state/receivedReviews/actions"
import { peerReviewsReducer } from "../../state/peerReviews/reducer"

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

  // const receivedReviews: PeerReviewAnswer[] = [
  //   {
  //     quizAnswerId: "weui",
  //     peerReviewCollectionId: "safd",
  //     userId: 666,
  //     rejectedQuizAnswerIds: [],
  //     answers: [
  //       {
  //         peerReviewQuestionId: "111-222",
  //         value: 3,
  //       },
  //       {
  //         peerReviewQuestionId: "222-222",
  //         text: "Oikein huono",
  //       },
  //     ],
  //   },
  // ]

  if (
    loadingState === "loading" ||
    (loadingState === "began" && receivedReviews.length < 1)
  ) {
    return <div>Loading...</div>
  }

  if (loadingState === "error") {
    return <div>Something odd occurred. Try reloading</div>
  }

  return (
    <>
      {modalOpened ? (
        <ReceivedReviewsDetailed peerReviews={receivedReviews} />
      ) : (
        <ReceivedReviewsSummary peerReviews={receivedReviews} />
      )}
      <Button variant="outlined" onClick={() => setModalOpened(!modalOpened)}>
        Toggle mode
      </Button>
    </>
  )
}

interface IReceivedReviewsProps {
  peerReviews: IReceivedPeerReview[]
}

const ReceivedReviewsDetailed: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews }) => {
  return (
    <div>
      <h2>Details of all the reviews</h2>
      {peerReviews
        .map(r =>
          r.answers
            .map(ans => {
              let gradingPart
              if ((ans as PeerReviewGradeAnswer).value) {
                gradingPart = (ans as PeerReviewGradeAnswer).value
              } else {
                gradingPart = (ans as PeerReviewEssayAnswer).text
              }
              return ans.peerReviewQuestionId + ": " + gradingPart
            })
            .join(" , "),
        )
        .join(" ; ")}
    </div>
  )
}

const ReceivedReviewsSummary: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews }) => {
  return (
    <div>
      <h2>Overview of the reviews</h2>
      Number of the reviews you've received: {peerReviews.length}
    </div>
  )
}

export default ReceivedPeerReviews
