import * as React from "react"
import styled from "styled-components"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import Togglable from "../../utils/Togglable"
import { useTypedSelector } from "../../state/store"
import { PeerReviewLabels } from "../../utils/language_labels"

const BoldTypography = styled(Typography)`
  font-weight: bold;
`

const PeerReviews: React.FunctionComponent = () => {
  const dispatch = useDispatch()

  const quiz = useTypedSelector(state => state.quiz)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const peerReviewQuestions = quiz.peerReviewCollections
  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.peerReviews,
  )

  useEffect(() => {
    dispatch(peerReviewsActions.fetchPeerReviewAlternatives())
  }, [])

  const morePeerReviewsRequired = () =>
    (userQuizState ? userQuizState.peerReviewsGiven : 0) <
    quiz.course.minPeerReviewsGiven

  if (peerReviewQuestions.length === 0) {
    return (
      <Typography variant="subtitle1">
        Tähän tehtävään ei liity vertaisarvioita
      </Typography>
    )
  }

  return (
    <div>
      <PeerReviewsGuidance
        guidanceText={peerReviewQuestions[0].texts[0].body}
        givenLabel={languageInfo.givenPeerReviewsLabel}
        peerReviewsCompletedInfo={languageInfo.peerReviewsCompletedInfo}
      />

      {!morePeerReviewsRequired() && (
        <BoldTypography variant="subtitle1">
          {languageInfo.extraPeerReviewsEncouragementLabel}
        </BoldTypography>
      )}

      <Togglable
        initiallyVisible={morePeerReviewsRequired()}
        hideButtonText={languageInfo.hidePeerReviewLabel}
        displayButtonText={languageInfo.displayPeerReview}
      >
        <PeerReviewForm languageInfo={languageInfo} />
      </Togglable>
    </div>
  )
}

export default PeerReviews
