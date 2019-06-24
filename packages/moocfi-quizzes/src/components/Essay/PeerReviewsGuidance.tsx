import * as React from "react"
import { useSelector, shallowEqual } from "react-redux"
import Typography from "@material-ui/core/Typography"

type PeerReviewsGuidanceProps = {
  givenLabel: string
  peerReviewsCompletedInfo: string
  guidanceText: string
}

const PeerReviewsGuidance: React.FunctionComponent<
  PeerReviewsGuidanceProps
> = ({ givenLabel, guidanceText, peerReviewsCompletedInfo }) => {
  const quiz = useSelector((state: any) => state.quiz, shallowEqual)
  const userQuizState = useSelector(
    (state: any) => state.userQuizState,
    shallowEqual,
  )
  const given = userQuizState ? userQuizState.peerReviewsGiven : 0
  const required = quiz.course.minPeerReviewsGiven

  return (
    <div>
      <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
        {guidanceText}
      </Typography>
      <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
        {givenLabel}: {given}/{required}
      </Typography>
      <Typography variant="subtitle1">
        {given >= required && peerReviewsCompletedInfo}
      </Typography>
    </div>
  )
}

export default PeerReviewsGuidance
