import * as React from "react"
import { Button, Typography } from "@material-ui/core"
import {
  PeerReviewAnswer,
  PeerReviewQuestionAnswer,
  PeerReviewGradeAnswer,
  PeerReviewEssayAnswer,
} from "../../modelTypes"

const ReceivedPeerReviews: React.FunctionComponent<any> = () => {
  const [modalOpened, setModalOpened] = React.useState(false)

  const receivedReviews: PeerReviewAnswer[] = [
    {
      quizAnswerId: "weui",
      peerReviewCollectionId: "safd",
      userId: 666,
      rejectedQuizAnswerIds: [],
      answers: [
        {
          peerReviewQuestionId: "111-222",
          value: 3,
        },
        {
          peerReviewQuestionId: "222-222",
          text: "Oikein huono",
        },
      ],
    },
  ]

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
  peerReviews?: PeerReviewAnswer[]
}

const ReceivedReviewsDetailed: React.FunctionComponent<
  IReceivedReviewsProps
> = ({ peerReviews }) => {
  if (!peerReviews) {
    return <div>Info not available (may be loading)</div>
  }

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
  if (!peerReviews) {
    return <div>Info not available (may be loading)</div>
  }

  return (
    <div>
      <h2>Overview of the reviews</h2>
      Number of the reviews you've received: {peerReviews.length}
    </div>
  )
}

export default ReceivedPeerReviews
