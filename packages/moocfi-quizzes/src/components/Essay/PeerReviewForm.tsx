import * as React from "react"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import LikertScale from "likert-react"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import PeerReviewOption from "./PeerReviewOption"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import * as userActions from "../../state/user/actions"

import {
  getPeerReviewInfo,
  postSpamFlag,
  postPeerReview,
} from "../../services/peerReviewService"
import { Dispatch, useTypedSelector } from "../../state/store"
import { UserQuizState } from "../../state/user/reducer"

type PeerReviewFormProps = {
  languageInfo: any
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  languageInfo,
}) => {
  const answersToReview = useTypedSelector(state => state.peerReviews.options)
  const peerReview = useTypedSelector(state => state.peerReviews.answer)
  const submitLocked = useTypedSelector(state => state.peerReviews.submitLocked)
  const submitDisabled = useTypedSelector(
    state => state.peerReviews.submitDisabled,
  )
  const quiz = useTypedSelector(state => state.quiz)

  const peerReviewQuestions = quiz.peerReviewCollections
  const accessToken = useTypedSelector(state => state.user.accessToken)
  const languageId = useTypedSelector(state => state.language.languageId)

  const dispatch = useDispatch<Dispatch>()
  const setPeerReview = useCallback(
    (peerReview: any) =>
      dispatch(peerReviewsActions.setReviewAnswer(peerReview)),
    [],
  )

  const setUserQuizState = (newState: UserQuizState) =>
    dispatch(userActions.setQuizState(newState))

  const setSubmitLocked = useCallback(
    (status: boolean) => dispatch(peerReviewsActions.setSubmitLocked(status)),
    [dispatch],
  )

  const setSubmitDisabled = useCallback(
    (status: boolean) => dispatch(peerReviewsActions.setSubmitDisabled(status)),
    [dispatch],
  )

  const setAnswersToReview = useCallback(
    (alternatives: any) =>
      dispatch(peerReviewsActions.setReviewOptions(alternatives)),
    [dispatch],
  )

  const currentAnswersToReview = peerReview
    ? answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
    : answersToReview

  const fetchAnswersToReview = async () => {
    const answerAlternatives = await getPeerReviewInfo(
      quiz.id,
      languageId,
      accessToken,
    )
    setAnswersToReview(answerAlternatives)
  }

  const handlePeerReviewGradeChange = peerReviewQuestionId => (
    question: any,
    value: string,
  ) => {
    const answers = peerReview.answers.map(answer => {
      if (answer.peerReviewQuestionId === peerReviewQuestionId) {
        const updated = { ...answer }
        updated.value = Number(value)
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

  const flagAsSpam = quizAnswerId => async () => {
    setAnswersToReview(undefined)
    await postSpamFlag(quizAnswerId, accessToken)
    await fetchAnswersToReview()
  }

  const selectAnswer = (quizAnswerId: string) => event => {
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
  return (
    <>
      <Typography variant="subtitle1">
        Valitse yksi vaihtoehdoista vertaisarvoitavaksi
      </Typography>
      {!currentAnswersToReview ? (
        <Grid container>
          <Grid item xs={1}>
            <CircularProgress size={25} />
          </Grid>
          <Grid item>
            <Typography>{languageInfo.loadingLabel}</Typography>
          </Grid>
        </Grid>
      ) : currentAnswersToReview.length === 0 ? (
        <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
      ) : (
        currentAnswersToReview.map(answer => (
          <div key={answer.id}>
            <PeerReviewOption answer={answer} />

            {peerReview ? (
              <div>
                {peerReviewQuestions[0].questions.map(question => {
                  const currentAnswerValue = peerReview.answers.find(
                    answer => answer.peerReviewQuestionId === question.id,
                  ).value

                  return (
                    <LikertScale
                      key={question.id}
                      reviews={[
                        {
                          question: question.texts[0].title,
                          review: currentAnswerValue,
                        },
                      ]}
                      onClick={handlePeerReviewGradeChange(question.id)}
                    />
                  )
                })}
                <Button
                  disabled={submitLocked ? true : submitDisabled}
                  onClick={submitPeerReview}
                >
                  {languageInfo.submitPeerReviewLabel}
                </Button>
              </div>
            ) : (
              <Grid container>
                <Grid item xs={3}>
                  <Button onClick={flagAsSpam(answer.id)}>
                    {languageInfo.reportAsInappropriateLabel}
                  </Button>
                </Grid>
                <Grid item xs={8} />
                <Grid item xs={1}>
                  <Button onClick={selectAnswer(answer.id)}>
                    {languageInfo.choosePeerEssayLabel}
                  </Button>
                </Grid>
              </Grid>
            )}
          </div>
        ))
      )}
    </>
  )
}

export default PeerReviewForm
