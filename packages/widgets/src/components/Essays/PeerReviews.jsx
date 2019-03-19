import React, { Component } from "react"
import axios from "axios"
import LikertScale from "likert-react"
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core"
import "likert-react/dist/main.css"
import { BASE_URL } from "../../config"

const paper = {
  padding: 10,
  margin: 10,
}

class PeerReviews extends Component {
  state = {
    peerReview: undefined,
    answersToReview: undefined,
    submitDisabled: true,
    submitLocked: true,
  }

  componentDidMount() {
    this.fetchAnswersToReview()
  }

  fetchAnswersToReview = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/v1/quizzes/peerreview/${this.props.quizId}/${
        this.props.languageId
      }`,
      { headers: { authorization: `Bearer ${this.props.accessToken}` } },
    )
    this.setState({ answersToReview: response.data })
  }

  flagAsSpam = quizAnswerId => async event => {
    this.setState({ answersToReview: undefined })
    await axios.post(
      `${BASE_URL}/api/v1/quizzes/spamflag`,
      { quizAnswerId },
      { headers: { authorization: `Bearer ${this.props.accessToken}` } },
    )
    await this.fetchAnswersToReview()
  }

  selectAnswer = quizAnswerId => event => {
    const rejected = this.state.answersToReview.find(
      answer => answer.id != quizAnswerId,
    )
    const peerReview = {
      quizAnswerId,
      peerReviewCollectionId: this.props.peerReviewQuestions[0].id,
      rejectedQuizAnswerIds: rejected ? [rejected.id] : [],
      answers: this.props.peerReviewQuestions[0].questions.map(question => {
        return { peerReviewQuestionId: question.id }
      }),
    }
    this.setState({
      peerReview,
      submitLocked: false,
    })
  }

  handlePeerReviewGradeChange = peerReviewQuestionId => (question, value) => {
    const answers = this.state.peerReview.answers.map(answer => {
      if (answer.peerReviewQuestionId === peerReviewQuestionId) {
        const updated = { ...answer }
        updated.value = value
        return updated
      }
      return answer
    })
    const peerReview = this.state.peerReview
    const submitDisabled = answers.find(
      answer => !answer.hasOwnProperty("value"),
    )
      ? true
      : false
    this.setState({
      peerReview: { ...peerReview, ...{ answers } },
      submitDisabled,
    })
  }

  submitPeerReview = async () => {
    this.setState({ submitDisabled: true, submitLocked: true })
    const response = await axios.post(
      `${BASE_URL}/api/v1/quizzes/peerreview`,
      this.state.peerReview,
      { headers: { authorization: `Bearer ${this.props.accessToken}` } },
    )
    await this.fetchAnswersToReview()
    this.props.setUserQuizState(response.data.userQuizState)
    this.setState({ peerReview: undefined })
  }

  render() {
    const { peerReview, submitDisabled, submitLocked } = this.state

    const {
      peerReviewQuestions,
      peerReviewsGiven,
      peerReviewsRequired,
      languageInfo,
    } = this.props

    if (peerReviewQuestions.length === 0) {
      return (
        <Typography variant="subtitle1">
          Tähän tehtävään ei liity vertaisarvioita
        </Typography>
      )
    }

    const answersToReview = peerReview
      ? this.state.answersToReview.filter(
          answer => answer.id === peerReview.quizAnswerId,
        )
      : this.state.answersToReview

    return (
      <div>
        <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
          {peerReviewQuestions[0].texts[0].body}
        </Typography>
        <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
          {languageInfo.givenPeerReviewsLabel}: {peerReviewsGiven}/
          {peerReviewsRequired}
        </Typography>
        <Typography variant="subtitle1">
          Valitse yksi vaihtoehdoista vertaisarvoitavaksi
        </Typography>
        {!answersToReview ? (
          <Typography>
            {languageInfo.loadingLabel}
            {languageInfo.loadingLabel}
          </Typography>
        ) : answersToReview.length === 0 ? (
          <Typography>{languageInfo.noPeerAnswersAvailableLabel}</Typography>
        ) : (
          answersToReview.map(answer => (
            <div key={answer.id}>
              {answer.itemAnswers
                .filter(ia => {
                  const quizItem = this.props.quiz.items.find(
                    qi => qi.id === ia.quizItemId,
                  )
                  return quizItem.type === "essay"
                })
                .map(ia => {
                  return (
                    <Paper style={paper} key={ia.id}>
                      <Typography variant="body1">{ia.textData}</Typography>
                    </Paper>
                  )
                })}

              {peerReview ? (
                <div>
                  {peerReviewQuestions[0].questions.map(question => {
                    return (
                      <LikertScale
                        key={question.id}
                        reviews={[{ question: question.texts[0].title }]}
                        onClick={this.handlePeerReviewGradeChange(question.id)}
                      />
                    )
                  })}
                  <Button
                    disabled={submitLocked ? true : submitDisabled}
                    onClick={this.submitPeerReview}
                  >
                    {languageInfo.submitPeerReviewLabel}
                  </Button>
                </div>
              ) : (
                <Grid container>
                  <Grid item xs={3}>
                    <Button onClick={this.flagAsSpam(answer.id)}>
                      {languageInfo.reportAsInappropriateLabel}
                    </Button>
                  </Grid>
                  <Grid item xs={8} />
                  <Grid item xs={1}>
                    <Button onClick={this.selectAnswer(answer.id)}>
                      {languageInfo.choosePeerEssayLabel}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          ))
        )}
      </div>
    )
  }
}

export default PeerReviews
