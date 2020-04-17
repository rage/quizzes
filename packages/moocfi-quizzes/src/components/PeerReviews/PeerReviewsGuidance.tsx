import * as React from "react"
import { useTypedSelector } from "../../state/store"
import { SpaciousTypography } from "../styleComponents"
import MarkdownText from "../MarkdownText"

type PeerReviewsGuidanceProps = {
  givenLabel: string
  peerReviewsCompletedInfo: string
  guidanceText: string
}

const PeerReviewsGuidance: React.FunctionComponent<PeerReviewsGuidanceProps> = ({
  givenLabel,
  guidanceText,
  peerReviewsCompletedInfo,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const given = userQuizState ? userQuizState.peerReviewsGiven : 0
  const required = (quiz && quiz.course.minPeerReviewsGiven) || 0

  return (
    <div>
      <SpaciousTypography variant="subtitle1">
        {givenLabel}: {given}/{required}
      </SpaciousTypography>
      <MarkdownText variant="subtitle1">{guidanceText}</MarkdownText>
    </div>
  )
}

export default PeerReviewsGuidance
