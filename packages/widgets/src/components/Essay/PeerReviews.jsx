import React, { Component } from "react"
import axios from "axios"
import Typography from "@material-ui/core/Typography"
import "likert-react/dist/main.css"
import { BASE_URL } from "../../config"
import PeerReviewForm from "./PeerReviewForm"
import PeerReviewsGuidance from "./PeerReviewsGuidance"
import Togglable from "../../utils/Togglable"

class PeerReviews extends Component {
  state = {
    peerReview: undefined,
    answersToReview: undefined,
    submitDisabled: true,
    submitLocked: true,
  }

  morePeerReviewsRequired = () =>
    this.props.peerReviewsGiven < this.props.peerReviewsRequired

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

    this.props.setUserQuizState(response.data.userQuizState)
    this.setState({ peerReview: undefined })
    await this.fetchAnswersToReview()
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
        <PeerReviewsGuidance
          guidanceText={peerReviewQuestions[0].texts[0].body}
          givenLabel={languageInfo.givenPeerReviewsLabel}
          peerReviewsCompletedInfo={languageInfo.peerReviewsCompletedInfo}
          given={peerReviewsGiven}
          required={peerReviewsRequired}
        />

        {!this.morePeerReviewsRequired() && (
          <Typography variant="subtitle1">
            Olet jo antanut tarvittavan määrän vertaisarvioita. Voit halutessasi
            arvioida enemmänkin muiden vastauksia - tekemällä näin parannat myös
            oman vastauksesi todennäköisyyttä tulla vertaisarvioiduksi!
          </Typography>
        )}

        <Togglable
          initiallyVisible={this.morePeerReviewsRequired()}
          hideButtonText="Piilota vertaisarvio"
          displayButtonText="Tee vertaisarvio"
        >
          <PeerReviewForm
            answersToReview={answersToReview}
            languageInfo={languageInfo}
            peerReviewQuestions={peerReviewQuestions}
            peerReview={peerReview}
            handlePeerReviewGradeChange={this.handlePeerReviewGradeChange}
            submitLocked={submitLocked}
            submitPeerReview={this.submitPeerReview}
            flagAsSpam={this.flagAsSpam}
            quizItems={this.props.quiz.items}
            selectAnswer={this.selectAnswer}
            submitDisabled={submitDisabled}
          />
        </Togglable>
      </div>
    )
  }
}

export default PeerReviews
