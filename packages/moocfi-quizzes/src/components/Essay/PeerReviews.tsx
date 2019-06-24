import * as React from "react"
import { useCallback, useEffect } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import { getPeerReviewInfo } from "../../services/peerReviewService"
import Togglable from "../../utils/Togglable"

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

  const quiz = useSelector((state: any) => state.quiz, shallowEqual)
  const languageId = useSelector(
    (state: any) => state.language.languageId,
    shallowEqual,
  )
  const accessToken = useSelector((state: any) => state.user, shallowEqual)

  const userQuizState = useSelector((state: any) => state.userQuizState)

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
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {languageInfo.extraPeerReviewsEncouragement}
        </Typography>
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

export default PeerReviews
