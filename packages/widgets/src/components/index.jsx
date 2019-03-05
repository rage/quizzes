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
const accessToken = ""
const languageId = "en_US"

class Quiz extends Component {
  state = {
    quiz: undefined,
    quizAnswer: undefined,
    userCourseState: undefined,
    answersToReview: undefined,
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
    console.log(response.data)
    this.setState({
      quiz: response.data.quiz,
      quizAnswer,
      userQuizState: response.data.userQuizState
    })
  }

  handleTextFieldChange = (itemId) => (event) => {
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
    console.log(response.data)
    this.setState({
      quiz: response.data.quiz,
      quizAnswer: response.data.quizAnswer,
      userQuizState: response.data.userQuizState
    })
  }

  setUserQuizState = (userQuizState) => {
    this.setState({ userQuizState })
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
              quizId={id}
              key={item.id}
              accessToken={accessToken}
              languageId={languageId}
              answered={this.state.quizAnswer.id ? true : false}
              textData={this.state.quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id).textData}
              peerReviewsGiven={this.state.userQuizState.peerReviewsGiven}
              peerReviewQuestions={this.state.quiz.peerReviewQuestionCollections}
              submitMessage={this.state.quiz.texts[0].submitMessage}
              handleTextFieldChange={this.handleTextFieldChange(item.id)}
              setUserQuizState={this.setUserQuizState}
            />
          })}
          {
            this.state.quizAnswer.id
              ? ""
              : <Button onClick={this.handleSubmit}>Vastaa</Button>
          }
        </div>
      </div>
    )
  }
}

export default Quiz
