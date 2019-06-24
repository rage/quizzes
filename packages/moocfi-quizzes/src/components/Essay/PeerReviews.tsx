import * as React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import * as userQuizStateActions from "../../state/userQuizState/actions"
import {
  getPeerReviewInfo,
  postSpamFlag,
  postPeerReview,
} from "../../services/peerReviewService"
import Togglable from "../../utils/Togglable"
import { string } from "prop-types"

type PeerReviewsProps = {
  languageInfo: any
}

const PeerReviews: React.FunctionComponent<PeerReviewsProps> = ({
  languageInfo,
}) => {
  const dispatch = useDispatch()

  const [peerReview, setPeerReview] = useState(undefined)
  const [answersToReview, setAnswersToReview] = useState(undefined)
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [submitLocked, setSubmitLocked] = useState(true)

  const quiz = useSelector((state: any) => state.quiz, shallowEqual)
  const languageId = useSelector(
    (state: any) => state.language.languageId,
    shallowEqual,
  )
  const accessToken = useSelector((state: any) => state.user, shallowEqual)

  const userQuizState = useSelector((state: any) => state.userQuizState)
  const setUserQuizState = newState =>
    dispatch(userQuizStateActions.set(newState))

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
    (userQuizState.peerReviewsGiven || 0) < quiz.course.minPeerReviewsGiven

  const flagAsSpam = quizAnswerId => async () => {
    setAnswersToReview(undefined)
    await postSpamFlag(quizAnswerId, accessToken)
    await fetchAnswersToReview()
  }

  const selectAnswer = quizAnswerId => event => {
    const rejected = answersToReview.find(answer => answer.id !== quizAnswerId)
    const peerReview = {
      quizAnswerId,
      peerReviewCollectionId: quiz.peerReviewCollections[0].id,
      rejectedQuizAnswerIds: rejected ? [rejected.id] : [],
      answers: quiz.peerReviewCollections[0].questions.map(question => {
        return { peerReviewQuestionId: question.id }
      }),
    }
    setPeerReview(peerReview)
    setSubmitLocked(false)
  }

  const handlePeerReviewGradeChange = peerReviewQuestionId => (
    question,
    value,
  ) => {
    const answers = peerReview.answers.map(answer => {
      if (answer.peerReviewQuestionId === peerReviewQuestionId) {
        const updated = { ...answer }
        updated.value = value
        return updated
      }
      return answer
    })
    const submitDisabled = answers.find(
      answer => !answer.hasOwnProperty("value"),
    )
      ? true
      : false

    setPeerReview({ ...peerReview, ...{ answers } })
    setSubmitDisabled(submitDisabled)
  }

  const submitPeerReview = async () => {
    setSubmitDisabled(true)
    setSubmitLocked(true)
    const { userQuizState } = await postPeerReview(peerReview, accessToken)

    setUserQuizState(userQuizState)
    setPeerReview(undefined)
    fetchAnswersToReview()
  }

  if (peerReviewQuestions.length === 0) {
    return (
      <Typography variant="subtitle1">
        Tähän tehtävään ei liity vertaisarvioita
      </Typography>
    )
  }

  const currentAnswersToReview = peerReview
    ? answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
    : answersToReview

  return (
    <div>
      <PeerReviewsGuidance
        guidanceText={peerReviewQuestions[0].texts[0].body}
        givenLabel={languageInfo.givenPeerReviewsLabel}
        peerReviewsCompletedInfo={languageInfo.peerReviewsCompletedInfo}
      />

      {!this.morePeerReviewsRequired() && (
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {languageInfo.extraPeerReviewsEncouragement}
        </Typography>
      )}

      <Togglable
        initiallyVisible={morePeerReviewsRequired()}
        hideButtonText={languageInfo.hidePeerReview}
        displayButtonText={languageInfo.displayPeerReview}
      >
        <PeerReviewForm
          answersToReview={currentAnswersToReview}
          languageInfo={languageInfo}
          peerReview={peerReview}
          handlePeerReviewGradeChange={handlePeerReviewGradeChange}
          submitLocked={submitLocked}
          submitPeerReview={submitPeerReview}
          flagAsSpam={flagAsSpam}
          selectAnswer={selectAnswer}
          submitDisabled={submitDisabled}
        />
      </Togglable>
    </div>
  )
}

export default PeerReviews
