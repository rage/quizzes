import React, { Component } from "react"
import { Button, Typography } from "@material-ui/core"
import Checkbox from './Checkbox'
import Essay from "./Essay"
import MultipleChoice from "./MultipleChoice"
import Scale from './Scale'
import Unsupported from './Unsupported'
import axios from "axios"

const mapTypeToComponent = {
  essay: Essay,
  "multiple-choice": MultipleChoice,
  scale: Scale,
  checkbox: Checkbox
}



const componentType = (typeName) => {
  let component = mapTypeToComponent[typeName]
  return component === undefined ? Unsupported : component
}

class Quiz extends Component {
  state = {
    quiz: undefined,
    quizAnswer: undefined,
    userCourseState: undefined,
    submitLocked: false,
    correctCount: null
  }

  async componentDidMount() {
    const { id, languageId, accessToken } = this.props
    const response = await axios.get(
      `http://localhost:3000/api/v1/quizzes/${id}?language=${languageId}`,
      { headers: { authorization: `Bearer ${accessToken}` } }
    )

    console.log(response.data)
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
            intData: null,
            optionAnswers: []
          }
        })
      }
    }
    this.setState({
      quiz: response.data.quiz,
      quizAnswer,
      userQuizState: response.data.userQuizState
    })
  }

  handleTextDataChange = (itemId) => (event) => {
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

  handleIntDataChange = (itemId) => (event) => {
    //conversion to be sure
    const value = Number(event.target.value)
    const itemAnswers = this.state.quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        return { ...itemAnswer, intData: value }
      }
      return itemAnswer
    })

    this.setState({ quizAnswer: { ...this.state.quizAnswer, ...{ itemAnswers } } })
  }

  handleOptionChange = (itemId) => (optionId) => () => {


    //return the optionAnswers to the same as it was before any answer
    if (typeof optionId === "number" && optionId < 0) {
      console.log("here i am")

      const quizAnswer = this.state.quizAnswer
      const itemAnswers = this.state.quizAnswer.itemAnswers
      const newItemAnswers = itemAnswers.map(ia => {
        if (ia.quizItemId === itemId) {
          console.log("HEEEE")
          return { ...ia, optionAnswers: [] }
        } else {
          return ia
        }
      })

      this.setState({
        quizAnswer: {
          ...quizAnswer,
          itemAnswers: newItemAnswers
        }
      })

      return
    }


    const multi = this.state.quiz.items.find(item => item.id === itemId).multi
    const itemAnswers = this.state.quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        if (multi) {
          if (updated.optionAnswers.find(oa => oa.quizOptionId === optionId)) {
            updated.optionAnswers = updated.optionAnswers.filter(oa => oa.quizOptionId !== optionId)
          } else {
            updated.optionAnswers = [...updated.optionAnswers, { quizOptionId: optionId }]
          }
        } else {
          updated.optionAnswers = [{ quizOptionId: optionId }]
        }
        return updated
      }
      return itemAnswer
    })
    const quizAnswer = this.state.quizAnswer
    this.setState({ quizAnswer: { ...quizAnswer, ...{ itemAnswers } } })
  }

  handleSubmit = async (event) => {
    this.setState({ submitLocked: true })
    const response = await axios.post(
      `http://localhost:3000/api/v1/quizzes/answer`,
      this.state.quizAnswer,
      { headers: { authorization: `Bearer ${this.props.accessToken}` } }
    )
    this.setState({
      quiz: response.data.quiz,
      quizAnswer: response.data.quizAnswer,
      userQuizState: response.data.userQuizState
    })
  }

  setUserQuizState = (userQuizState) => {
    this.setState({ userQuizState })
  }

  submitDisabled() {
    const submittable = this.state.quiz.items.map(item => {
      const itemAnswer = this.state.quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id)
      if (item.type === "essay") {
        return itemAnswer.textData ? true : false
      }
      if (item.type === "multiple-choice") {
        return itemAnswer.optionAnswers.length > 0
      }
      if (item.type === "scale") {
        return itemAnswer.intData ? true : false
      }
    })
    return submittable.includes(false)
  }



  render() {

    const {
      quiz,
      quizAnswer,
      userQuizState
    } = this.state

    const {
      id,
      languageId,
      accessToken
    } = this.props


    if (!accessToken) {
      return <div>Kirjaudu sisään vastataksesi tehtävään</div>
    }

    if (!quiz) {
      return <div>Loading</div>
    }

    return (
      <div>
        <Typography variant="h4">{quiz.texts[0].title}</Typography>
        <div>
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }} />
          {quiz.items.map(item => {
            const itemAnswer = quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id)
            const ItemComponent = componentType(item.type)
            return <ItemComponent
              item={item}
              quizId={id}
              key={item.id}
              accessToken={accessToken}
              languageId={languageId}
              answered={quizAnswer.id ? true : false}
              intData={itemAnswer.intData}
              textData={itemAnswer.textData}
              optionAnswers={itemAnswer.optionAnswers}
              multi={item.multi}
              correct={itemAnswer.correct}
              successMessage={item.texts[0].successMessage}
              failureMessage={item.texts[0].failureMessage}
              peerReviewsGiven={userQuizState ? userQuizState.peerReviewsGiven : 0}
              itemTitle={item.texts[0].title}
              options={item.options}
              peerReviewQuestions={quiz.peerReviewQuestionCollections}
              submitMessage={quiz.texts[0].submitMessage}
              handleTextDataChange={this.handleTextDataChange(item.id)}
              handleIntDataChange={this.handleIntDataChange(item.id)}
              handleOptionChange={this.handleOptionChange(item.id)}
              setUserQuizState={this.setUserQuizState}
            />
          })}
          {
            quizAnswer.id
              ? ""
              :
              <div>
                <Button
                  disabled={this.state.submitLocked ? true : this.submitDisabled()}
                  onClick={this.handleSubmit}>Vastaa</Button>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default Quiz
