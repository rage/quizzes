import React, { Component } from "react"
import { Button, Typography } from "@material-ui/core"
import Essay from "./Essay"
import MultipleChoice from "./MultipleChoice"
import axios from "axios"

const mapTypeToComponent = {
  essay: Essay,
  "multiple-choice": MultipleChoice,
}

const id = "3c954097-268f-44bf-9d2e-1efaf9e8f122"
const accessToken = "1436f0ed8869efc9d89ce0b6706d9ba07747490e2ed5b2ef3dd18caf0f0ac04a"
const languageId = "en_US"

class Quiz extends Component {
  state = {
    quiz: undefined,
    quizAnswer: undefined,
    answersToReview: [],
    peerReview: undefined,
    selectedAnswer: undefined
  }

  async componentDidMount() {
    // const { id, languageId, accessToken } = this.props
    const response = await axios.get(
      `http://localhost:3000/api/v1/quizzes/${id}`,
      { headers: { authorization: `Bearer ${accessToken}` } }
    )
    const quiz = response.data.quiz
    let quizAnswer = response.data.quizAnswer
    if (!quizAnswer) {
      quizAnswer = {
        quizId: quiz.id,
        languageId,
        itemAnswers: response.data.quiz.items.map(item => {
          return {
            quizItemId: item.id,
            textData: "",
            intData: null
          }
        })
      }
    }
    console.log(quiz)
    this.setState({
      quiz: response.data.quiz,
      quizAnswer
    })
  }

  fetchAnswersToReview = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/v1/quizzes/peerreview/${id}/${languageId}`,
      { headers: { authorization: `Bearer ${accessToken}` } }
    )
    this.setState({ answersToReview: response.data })
  }

  handleEssayFieldChange = (itemId) => (event) => {
    const value = event.target.value
    const itemAnswers = this.state.quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        updated.textData = value
        return updated
      }
      return itemAnswer
    })
    const quizAnswer = this.state.quizAnswer
    this.setState({ quizAnswer: { ...quizAnswer, ...{ itemAnswers } } })
  }

  handleSubmit = async (event) => {
    const response = await axios.post(
      `http://localhost:3000/api/v1/quizzes/answer`,
      this.state.quizAnswer,
      { headers: { authorization: `Bearer ${accessToken}` } }
    )
    this.setState({
      quiz: response.data.quiz,
      quizAnswer: response.data.quizAnswer
    })
  }

  flagAsSpam = (quizAnswerId) => async (event) => {
    await axios.post(
      "http://localhost:3000/api/v1/quizzes/spamflag",
      { quizAnswerId },
      { headers: { authorization: `Bearer ${accessToken}` } }
    )
    await this.fetchAnswersToReview()
  }

  selectAnswer = (quizAnswerId) => (event) => {
    this.setState((prevState) => {
      return {
        peerReview: {
          quizAnswerId,
          peerReviewQuestionCollectionId: prevState.quiz.peerReviewQuestionCollections[0].id,
          rejectedQuizAnswerIds: [prevState.answersToReview.find(answer => answer.id != quizAnswerId).id],
          answers: prevState.quiz.peerReviewQuestionCollections[0].questions.map(question => { return { peerReviewQuestionId: question.id } })
        }
      }
    })
  }

  handlePeerReviewGradeChange = (peerReviewQuestionId) => (question, value) => {
    const answers = this.state.peerReview.answers.map(answer => {
      if (answer.peerReviewQuestionId === peerReviewQuestionId) {
        const updated = { ...answer }
        updated.value = value
        return updated
      }
      return answer
    })
    const peerReview = this.state.peerReview
    this.setState({ peerReview: { ...peerReview, ...{ answers } } })
  }

  submitPeerReview = async () => {
    await axios.post(
      "http://localhost:3000/api/v1/quizzes/peerreview",
      this.state.peerReview,
      { headers: { authorization: `Bearer ${accessToken}` } }
    )
    await this.fetchAnswersToReview()
    this.setState({ peerReview: undefined })
  }

  render() {
    if (!this.state.quiz) {
      return <div>Loading</div>
    }
    return (
      <div>
        <Typography variant="h4">{this.state.quiz.texts[0].title}</Typography>
        <div>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: this.state.quiz.texts[0].body }} />
          {this.state.quiz.items.map(item => {
            const ItemComponent = mapTypeToComponent[item.type]
            return <ItemComponent
              key={item.id}
              answered={this.state.quizAnswer.id ? true : false}
              peerReview={this.state.peerReview}
              textData={this.state.quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id).textData}
              answersToReview={this.state.answersToReview}
              peerReviewQuestions={this.state.quiz.peerReviewQuestionCollections}
              handleEssayFieldChange={this.handleEssayFieldChange(item.id)}
              fetchAnswersToReview={this.fetchAnswersToReview}
              selectAnswer={this.selectAnswer}
              flagAsSpam={this.flagAsSpam}
              handlePeerReviewGradeChange={this.handlePeerReviewGradeChange}
              submitPeerReview={this.submitPeerReview}
            />
          })}
          {
            this.state.quizAnswer.id
              ? ""
              : <Button onClick={this.handleSubmit}>Submit</Button>
          }
        </div>
      </div>
    )
  }
}

export default Quiz
