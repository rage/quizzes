import * as React from "react"
import { useSelector, shallowEqual } from "react-redux"
import LikertScale from "likert-react"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import PeerReviewOption from "./PeerReviewOption"

type PeerReviewFormProps = {
  answersToReview: any
  languageInfo: any
  peerReview: any
  handlePeerReviewGradeChange: (a: any) => any
  submitDisabled: boolean
  submitLocked: boolean
  submitPeerReview: (a: any) => any
  flagAsSpam: (a: any) => any
  selectAnswer: (a: any) => any
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  answersToReview,
  languageInfo,
  peerReview,
  handlePeerReviewGradeChange,
  submitLocked,
  submitPeerReview,
  flagAsSpam,
  selectAnswer,
  submitDisabled,
}) => {
  const quiz = useSelector((state: any) => state.quiz, shallowEqual)
  const peerReviewQuestions = quiz.peerReviewCollections
  const quizItems = quiz.items

  return (
    <>
      <Typography variant="subtitle1">
        Valitse yksi vaihtoehdoista vertaisarvoitavaksi
      </Typography>
      {!answersToReview ? (
        <Grid container>
          <Grid item xs={1}>
            <CircularProgress size={25} />
          </Grid>
          <Grid item>
            <Typography>{languageInfo.loadingLabel}</Typography>
          </Grid>
        </Grid>
      ) : answersToReview.length === 0 ? (
        <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
      ) : (
        answersToReview.map(answer => (
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
