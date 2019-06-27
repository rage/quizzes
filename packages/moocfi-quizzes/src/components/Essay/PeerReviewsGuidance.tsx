import * as React from "react"
import Typography from "@material-ui/core/Typography"
import { useTypedSelector } from "../../state/store"
import { SpaciousTypography } from "../styleComponents"

type PeerReviewsGuidanceProps = {
  givenLabel: string
  peerReviewsCompletedInfo: string
  guidanceText: string
}

const PeerReviewsGuidance: React.FunctionComponent<
  PeerReviewsGuidanceProps
> = ({ givenLabel, guidanceText, peerReviewsCompletedInfo }) => {
  const quiz = useTypedSelector(state => state.quiz)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const given = userQuizState ? userQuizState.peerReviewsGiven : 0
  const required = quiz.course.minPeerReviewsGiven

  return (
    <div>
      <SpaciousTypography variant="subtitle1">
        {guidanceText}
      </SpaciousTypography>
      <SpaciousTypography variant="subtitle1">
        {givenLabel}: {given}/{required}
      </SpaciousTypography>
      <SpaciousTypography variant="subtitle1">
        {given >= required && peerReviewsCompletedInfo}
      </SpaciousTypography>
    </div>
  )
}

export default PeerReviewsGuidance
