import React, { Component } from "react"
import { Button, Typography, Grid } from "@material-ui/core"
import Checkbox from "./Checkbox"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import EssayStageContainer from "./Essay/Essay"
import StageVisualizer from "./Essay/StageVisualizer"
import PeerReviews from "./Essay/PeerReviews"
import Unsupported from "./Unsupported"
import axios from "axios"
import { BASE_URL } from "../config"
import languageLabels from "../utils/language_labels"

const mapTypeToComponent = {
  essay: EssayStageContainer,
  "multiple-choice": MultipleChoice,
  scale: Scale,
  checkbox: Checkbox,
  open: Open,
  "research-agreement": ResearchAgreement,
  feedback: Feedback,
}

const componentType = typeName => {
  let component = mapTypeToComponent[typeName]
  return component === undefined ? Unsupported : component
}

class Quiz extends Component {
  state = {
    quiz: undefined,
    quizAnswer: undefined,
    userCourseState: undefined,
    submitLocked: false,
    correctCount: null,
    error: undefined,
  }

  async componentDidMount() {
    const { id, languageId, accessToken } = this.props
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/quizzes/${id}?language=${languageId}`,
        { headers: { authorization: `Bearer ${accessToken}` } },
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
              intData: null,
              optionAnswers: [],
            }
          }),
        }
      }
      this.setState({
        quiz,
        quizAnswer,
        userQuizState: response.data.userQuizState,
      })
    } catch (e) {
      this.setState({ error: e.toString() })
    }
  }

  handleDataChange = (itemId, attributeName) => event => {
    const value = event.target.value
    const itemAnswers = this.state.quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        updated[attributeName] = value
        return updated
      }
      return itemAnswer
    })
    const quizAnswer = this.state.quizAnswer
    this.setState({ quizAnswer: { ...quizAnswer, ...{ itemAnswers } } })
  }

  handleTextDataChange = itemId => this.handleDataChange(itemId, "textData")

  handleIntDataChange = itemId => this.handleDataChange(itemId, "intData")

  handleCheckboxToggling = itemId => optionId => () => {
    const quizAnswer = this.state.quizAnswer
    const itemAnswers = quizAnswer.itemAnswers
    const itemAnswer = itemAnswers.find(ia => ia.quizItemId === itemId)

    const currentOptionValue = itemAnswer.optionAnswers.find(
      oa => oa.quizOptionId === optionId,
    )

    const newItemAnswer = {
      ...itemAnswer,
      optionAnswers: currentOptionValue
        ? itemAnswer.optionAnswers.filter(oa => oa.quizOptionId !== optionId)
        : itemAnswer.optionAnswers.concat({ quizOptionId: optionId }),
    }

    this.setState({
      quizAnswer: {
        ...quizAnswer,
        itemAnswers: itemAnswers.map(ia =>
          ia.quizItemId === itemId ? newItemAnswer : ia,
        ),
      },
    })
  }

  handleOptionChange = itemId => optionId => () => {
    const multi = this.state.quiz.items.find(item => item.id === itemId).multi
    const itemAnswers = this.state.quizAnswer.itemAnswers.map(itemAnswer => {
      if (itemAnswer.quizItemId === itemId) {
        const updated = { ...itemAnswer }
        if (multi) {
          if (updated.optionAnswers.find(oa => oa.quizOptionId === optionId)) {
            updated.optionAnswers = updated.optionAnswers.filter(
              oa => oa.quizOptionId !== optionId,
            )
          } else {
            updated.optionAnswers = [
              ...updated.optionAnswers,
              { quizOptionId: optionId },
            ]
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

  handleSubmit = async event => {
    this.setState({ submitLocked: true })
    const response = await axios.post(
      `${BASE_URL}/api/v1/quizzes/answer`,
      this.state.quizAnswer,
      {
        headers: { authorization: `Bearer ${this.props.accessToken}` },
      },
    )
    this.setState({
      quiz: response.data.quiz,
      quizAnswer: response.data.quizAnswer,
      userQuizState: response.data.userQuizState,
    })
  }

  setUserQuizState = userQuizState => {
    this.setState({ userQuizState })
  }

  // not all quizzess have correct solutions - e.g. self-evaluation
  hasCorrectAnswer = quiz => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  atLeastOneCorrect = itemAnswers => itemAnswers.some(ia => ia.correct === true)

  submitDisabled() {
    const submittable = this.state.quiz.items.map(item => {
      const itemAnswer = this.state.quizAnswer.itemAnswers.find(
        ia => ia.quizItemId === item.id,
      )
      if (
        item.type === "essay" ||
        item.type === "open" ||
        item.type === "feedback"
      ) {
        return itemAnswer.textData ? true : false
      }
      if (item.type === "multiple-choice") {
        return itemAnswer.optionAnswers.length > 0
      }
      if (item.type === "scale") {
        return itemAnswer.intData ? true : false
      }
      if (item.type === "checkbox" || item.type === "research-agreement") {
        return itemAnswer.optionAnswers.length > 0
      }
    })

    return submittable.includes(false)
  }

  quizContainsEssay = () => {
    return this.state.quiz.items.some(ia => ia.type === "essay")
  }

  quizItemComponents = (quiz, languageId, accessToken) => {
    const { quizAnswer, userQuizState } = this.state

    return (
      <React.Fragment>
        {quiz.items
          .sort((i1, i2) => i1.order - i2.order)
          .map(item => {
            const itemAnswer = quizAnswer.itemAnswers.find(
              ia => ia.quizItemId === item.id,
            )
            const ItemComponent = componentType(item.type)

            return (
              <ItemComponent
                quiz={quiz}
                quizAnswer={quizAnswer}
                item={item}
                quizId={quiz.id}
                key={item.id}
                accessToken={accessToken}
                languageId={languageId}
                languageInfo={languageLabels(languageId, item.type)}
                answered={quizAnswer.id ? true : false}
                intData={itemAnswer.intData}
                textData={itemAnswer.textData}
                optionAnswers={itemAnswer.optionAnswers}
                multi={item.multi}
                singleItem={quiz.items.length === 1}
                correct={itemAnswer.correct}
                successMessage={item.texts[0].successMessage}
                failureMessage={item.texts[0].failureMessage}
                peerReviewsGiven={
                  userQuizState ? userQuizState.peerReviewsGiven : 0
                }
                peerReviewsRequired={quiz.course.minPeerReviewsGiven}
                itemTitle={item.texts[0].title}
                itemBody={item.texts[0].body}
                options={item.options}
                peerReviewQuestions={quiz.peerReviewCollections}
                submitMessage={quiz.texts[0].submitMessage}
                handleTextDataChange={this.handleTextDataChange(item.id)}
                handleIntDataChange={this.handleIntDataChange(item.id)}
                handleOptionChange={this.handleOptionChange(item.id)}
                setUserQuizState={this.setUserQuizState}
              />
            )
          })}
      </React.Fragment>
    )
  }

  render() {
    const { quiz, quizAnswer, userQuizState, error } = this.state
    const { languageId, accessToken } = this.props

    if (!accessToken) {
      return <div>Kirjaudu sisään vastataksesi tehtävään</div>
    }

    if (error) {
      return (
        <div>
          Error
          <pre>{error}</pre>
        </div>
      )
    }

    if (!quiz) {
      return <div>Loading</div>
    }

    const types = quiz.items.map(item => item.type)

    return (
      <div>
        <Typography variant="h5" style={{ paddingBottom: 10 }}>
          {quiz.texts[0].title}
        </Typography>
        <Typography
          variant="body1"
          style={{ paddingBottom: 10 }}
          dangerouslySetInnerHTML={{ __html: quiz.texts[0].body }}
        />

        <div>
          {this.quizContainsEssay() && (
            <StageVisualizer
              answered={quizAnswer.id ? true : false}
              peerReviewsGiven={
                this.state.userQuizState
                  ? this.state.userQuizState.peerReviewsGiven
                  : 0
              }
              peerReviewsRequired={quiz.course.minPeerReviewsGiven}
            />
          )}

          {this.quizItemComponents(quiz, languageId, accessToken)}

          {quizAnswer.id ? (
            <React.Fragment>
              {this.quizContainsEssay() && (
                <PeerReviews
                  quiz={quiz}
                  quizId={quiz.id}
                  languageId={languageId}
                  languageInfo={languageLabels(languageId, "essay")}
                  accessToken={accessToken}
                  peerReviewQuestions={quiz.peerReviewCollections}
                  peerReviewsGiven={
                    userQuizState ? userQuizState.peerReviewsGiven : 0
                  }
                  peerReviewsRequired={quiz.course.minPeerReviewsGiven}
                  setUserQuizState={this.setUserQuizState}
                />
              )}

              <Typography variant="h5">
                {this.hasCorrectAnswer(quiz)
                  ? this.atLeastOneCorrect(quizAnswer.itemAnswers)
                    ? quiz.items.length === 1
                      ? "Tehtävä oikein"
                      : `Sait ${
                          quizAnswer.itemAnswers.filter(
                            ia => ia.correct === true,
                          ).length
                        }/${quiz.items.length} oikein`
                    : types.includes("essay") || types.includes("scale")
                    ? ""
                    : "Tehtävä väärin"
                  : "Olet jo vastannut"}
              </Typography>
            </React.Fragment>
          ) : (
            <div>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  this.state.submitLocked ? true : this.submitDisabled()
                }
                onClick={this.handleSubmit}
              >
                Vastaa
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Quiz
