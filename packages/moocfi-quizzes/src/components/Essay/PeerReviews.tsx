import * as React from "react"
import styled from "styled-components"
import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import { getPeerReviewInfo } from "../../services/peerReviewService"
import Togglable from "../../utils/Togglable"
import { useTypedSelector } from "../../state/store"

type PeerReviewsProps = {
  languageInfo: any
}

const PeerReviews: React.FunctionComponent<PeerReviewsProps> = ({
  languageInfo,
}) => {
  const dispatch = useDispatch()

  const setAnswersToReview = useCallback(
    (alternatives: any) =>
      dispatch(peerReviewsActions.setReviewOptions(alternatives)),
    [],
  )

  const quiz = useTypedSelector(state => state.quiz)
  const languageId = useTypedSelector(state => state.language.languageId)
  const accessToken = useTypedSelector(state => state.user.accessToken)

  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const peerReviewQuestions = quiz.peerReviewCollections

  useEffect(() => {
    fetchAnswersToReview()
  }, [])

  const fetchAnswersToReview = async () => {
    const answerAlternatives = await getPeerReviewInfo(
      quiz.id,
      languageId,
      accessToken,
    )
    setAnswersToReview(answerAlternatives)
  }

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
          {languageInfo.extraPeerReviewsEncouragement}
        </BoldTypography>
      )}

      <Togglable
        initiallyVisible={morePeerReviewsRequired()}
        hideButtonText={languageInfo.hidePeerReview}
        displayButtonText={languageInfo.displayPeerReview}
      >
        <PeerReviewForm languageInfo={languageInfo} />
      </Togglable>
    </div>
  )
}

const BoldTypography = styled(Typography)`
  font-weight: bold;
`

export default PeerReviews
