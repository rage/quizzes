import * as React from "react"
import styled from "styled-components"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import ReceivedPeerReviewsInfo from "./ReceivedPeerReviewsInfo"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import Togglable from "../../utils/Togglable"
import { useTypedSelector } from "../../state/store"
import { BoldTypography } from "../styleComponents"

const TopMarginDiv = styled.div`
  margin-top: 15px;
`

const PeerReviews: React.FunctionComponent = () => {
  const dispatch = useDispatch()

  const quiz = useTypedSelector(state => state.quiz)
  if (!quiz) {
    return <div />
  }

  const activeStep = useTypedSelector(state => state.peerReviews.activeStep)
  const pastDeadline = useTypedSelector(state => state.quizAnswer.pastDeadline)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const peerReviewQuestions = quiz.peerReviewCollections
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  if (!languageInfo) {
    return <div />
  }

  if (quizDisabled) {
    return (
      <Typography component="p" variant="subtitle1">
        {languageInfo.peerReviews.peerReviewsInfoForLoggedOutUser}
      </Typography>
    )
  }

  const peerReviewsLabels = languageInfo.peerReviews

  const giveExtraPeerReviewsLabel =
    activeStep >= 3
      ? peerReviewsLabels.giveExtraPeerReviewsQuizConfirmed
      : peerReviewsLabels.giveExtraPeerReviews

  useEffect(() => {
    dispatch(peerReviewsActions.fetchPeerReviewAlternatives())
  }, [])

  const morePeerReviewsRequired = () =>
    (userQuizState ? userQuizState.peerReviewsGiven : 0) <
    quiz.course.minPeerReviewsGiven

  if (peerReviewQuestions.length === 0) {
    return (
      <Typography component="p" variant="subtitle1">
        {peerReviewsLabels.quizInvolvesNoPeerReviewsInstruction}
      </Typography>
    )
  }

  return (
    <div>
      {activeStep >= 2 && <ReceivedPeerReviewsInfo />}
      {morePeerReviewsRequired()
        ? !pastDeadline && (
            <>
              <PeerReviewsGuidance
                guidanceText={peerReviewQuestions[0].texts[0].body}
                givenLabel={peerReviewsLabels.givenPeerReviewsLabel}
                peerReviewsCompletedInfo={
                  peerReviewsLabels.peerReviewsCompletedInfo
                }
              />
              <PeerReviewForm languageInfo={peerReviewsLabels} />
            </>
          )
        : !pastDeadline && (
            <>
              <BoldTypography component="p" variant="subtitle1">
                {giveExtraPeerReviewsLabel}
              </BoldTypography>
              <Togglable
                initiallyVisible={activeStep === 1}
                hideButtonText={peerReviewsLabels.hidePeerReviewLabel}
                displayButtonText={peerReviewsLabels.displayPeerReview}
              >
                <TopMarginDiv>
                  <PeerReviewsGuidance
                    guidanceText={peerReviewQuestions[0].texts[0].body}
                    givenLabel={peerReviewsLabels.givenPeerReviewsLabel}
                    peerReviewsCompletedInfo={
                      peerReviewsLabels.peerReviewsCompletedInfo
                    }
                  />
                  <PeerReviewForm languageInfo={peerReviewsLabels} />
                </TopMarginDiv>
              </Togglable>
            </>
          )}
    </div>
  )
}

export default PeerReviews
