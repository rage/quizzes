import * as React from "react"
import { useDispatch } from "react-redux"
import LikertScale from "likert-react"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import PeerReviewOption from "./PeerReviewOption"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import { Dispatch, useTypedSelector } from "../../state/store"
import { EssayLabels } from "../../utils/language_labels"

type PeerReviewFormProps = {
  languageInfo: EssayLabels
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

  const currentAnswersToReview = peerReview
    ? answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
    : answersToReview

  const dispatch = useDispatch<Dispatch>()

  const handlePeerReviewGradeChange = peerReviewQuestionId => (
    question: any,
    value: string,
  ) => {
    dispatch(
      peerReviewsActions.changeGrade(peerReviewQuestionId, Number(value)),
    )
  }

  const submitPeerReview = () => {
    dispatch(peerReviewsActions.submit())
  }

  const flagAsSpam = (quizAnswerId: string) => () => {
    dispatch(peerReviewsActions.postSpam(quizAnswerId))
  }

  const selectAnswer = (quizAnswerId: string) => () => {
    dispatch(peerReviewsActions.selectAnswerToReview(quizAnswerId))
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
