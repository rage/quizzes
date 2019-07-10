import * as React from "react"
import { useDispatch } from "react-redux"
import LikertScale from "likert-react"
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core"
import PeerReviewOption from "./PeerReviewOption"
import * as peerReviewsActions from "../../state/peerReviews/actions"
import { useTypedSelector } from "../../state/store"
import { PeerReviewLabels } from "../../utils/languages"
import {
  QuizAnswer,
  PeerReviewAnswer,
  PeerReviewQuestion,
} from "../../modelTypes"

type PeerReviewFormProps = {
  languageInfo: PeerReviewLabels
}

const PeerReviewForm: React.FunctionComponent<PeerReviewFormProps> = ({
  languageInfo,
}) => {
  const answersToReview = useTypedSelector(state => state.peerReviews.options)
  const peerReview = useTypedSelector(state => state.peerReviews.answer)
  const currentAnswersToReview = peerReview
    ? answersToReview.filter(answer => answer.id === peerReview.quizAnswerId)
    : answersToReview

  if (!currentAnswersToReview) {
    return (
      <Grid container>
        <Grid item xs={1}>
          <CircularProgress size={25} />
        </Grid>
        <Grid item>
          <Typography>{languageInfo.loadingLabel}</Typography>
        </Grid>
      </Grid>
    )
  }

  if (currentAnswersToReview.length === 0) {
    return <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
  }

  return (
    <>
      <Typography variant="subtitle1">
        {languageInfo.chooseEssayInstruction}
      </Typography>

      {currentAnswersToReview.map(answer => (
        <div key={answer.id}>
          <PeerReviewOption answer={answer} />

          {peerReview ? (
            <PeerReviewQuestions
              peerReview={peerReview}
              languageInfo={languageInfo}
            />
          ) : (
            <UnselectedPeerAnswerActions
              answer={answer}
              languageInfo={languageInfo}
            />
          )}
        </div>
      ))}
    </>
  )
}

type PeerReviewQuestionsProps = {
  peerReview: PeerReviewAnswer
  languageInfo: PeerReviewLabels
}

const PeerReviewQuestions: React.FunctionComponent<
  PeerReviewQuestionsProps
> = ({ peerReview, languageInfo }) => {
  const quiz = useTypedSelector(state => state.quiz)

  const submitDisabled = useTypedSelector(
    state => state.peerReviews.submitDisabled,
  )

  const dispatch = useDispatch()

  if (!quiz) {
    return <div />
  }

  const peerReviewQuestions = quiz.peerReviewCollections

  const changeInPeerReviewGrade = (peerReviewQuestionId: string) => (
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

  return (
    <div>
      {peerReviewQuestions[0].questions.map(question => {
        const currentPeerReviewAnswer = peerReview.answers.find(
          answer => answer.peerReviewQuestionId === question.id,
        )
        if (!currentPeerReviewAnswer) {
          return <div />
        }
        const currentAnswerValue = currentPeerReviewAnswer.value

        return (
          <LikertScale
            key={question.id}
            reviews={[
              {
                question: question.texts[0].title,
                review: currentAnswerValue,
              },
            ]}
            onClick={changeInPeerReviewGrade(question.id)}
          />
        )
      })}
      <Button disabled={submitDisabled} onClick={submitPeerReview}>
        {languageInfo.submitPeerReviewLabel}
      </Button>
    </div>
  )
}

type UnselectedPeerAnswerActionsProps = {
  languageInfo: PeerReviewLabels
  answer: QuizAnswer
}

const UnselectedPeerAnswerActions: React.FunctionComponent<
  UnselectedPeerAnswerActionsProps
> = ({ languageInfo, answer }) => {
  const dispatch = useDispatch()

  const flagAsSpam = () => {
    dispatch(peerReviewsActions.postSpam(answer.id))
  }

  const selectAnswer = () => {
    dispatch(peerReviewsActions.selectAnswerToReview(answer.id))
  }

  return (
    <Grid container>
      <Grid item xs={3}>
        <Button onClick={flagAsSpam}>
          {languageInfo.reportAsInappropriateLabel}
        </Button>
      </Grid>
      <Grid item xs={8} />
      <Grid item xs={1}>
        <Button onClick={selectAnswer}>{languageInfo.chooseButtonLabel}</Button>
      </Grid>
    </Grid>
  )
}

export default PeerReviewForm
