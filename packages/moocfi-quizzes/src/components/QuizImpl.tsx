import React, { useState } from "react"
import { connect } from "react-redux"
import { Button, Typography } from "@material-ui/core"
import Checkbox from "./Checkbox"
import Feedback from "./Feedback"
import MultipleChoice from "./MultipleChoice"
import ResearchAgreement from "./ResearchAgreement"
import Scale from "./Scale"
import Open from "./Open"
import Essay from "./Essay"
import StageVisualizer from "./Essay/StageVisualizer"
import PeerReviews from "./Essay/PeerReviews"
import Unsupported from "./Unsupported"
import languageLabels from "../utils/language_labels"
import { wordCount } from "../utils/string_tools"
import { UserCourseState, UserQuizState } from "../../../common/src/models"
import { postAnswer } from "../services/answerService"
import { getQuizInfo } from "../services/quizService"

import { setLanguage } from "../state/language/actions"

type QuizState = {
  quiz: any
  quizAnswer: any
  userCourseState: UserCourseState
  submitLocked: boolean
  correctCount: number
  error: string
  userQuizState: UserQuizState
}

type ComponentName =
  | "essay"
  | "multiple-choice"
  | "scale"
  | "checkbox"
  | "open"
  | "research-agreement"
  | "feedback"
  | "custom-frontend-accept-data"

const componentType = (typeName: ComponentName) => {
  const mapTypeToComponent = {
    essay: Essay,
    "multiple-choice": MultipleChoice,
    scale: Scale,
    checkbox: Checkbox,
    open: Open,
    "research-agreement": ResearchAgreement,
    feedback: Feedback,
    "custom-frontend-accept-data": Unsupported,
  }

  return mapTypeToComponent[typeName]
}

export interface Props {
  id: string
  languageId: string
  accessToken: string
  baseUrl: string
}

const FuncQuizImpl: React.FunctionComponent<Props> = ({
  id,
  languageId,
  accessToken,
}) => {
  const [quiz, setQuiz] = useState(null)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [userCourseState, setUserCourseState] = useState(null)
  const [submitLocked, setSubmitLocked] = useState(false)
  const [correctCount, setCorrectCount] = useState(null)
  const [error, setError] = useState(null)
  const [userQuizState, setUserQuizState] = useState(null)

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

  if (quiz.texts.length === 0) {
    return <div>Error: quiz has no texts.</div>
  }

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
            peerReviewsReceived={
              this.state.userQuizState
                ? this.state.userQuizState.peerReviewsReceived
                : 0
            }
            peerReviewsReceivedRequired={
              this.state.quiz.course.minPeerReviewsReceived
            }
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
                baseUrl={this.props.baseUrl}
              />
            )}

            <Typography variant="h5">
              {this.hasCorrectAnswer(quiz)
                ? this.atLeastOneCorrect(quizAnswer.itemAnswers)
                  ? quiz.items.length === 1
                    ? "Tehtävä oikein"
                    : `Sait ${
                        quizAnswer.itemAnswers.filter(ia => ia.correct === true)
                          .length
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
              disabled={this.state.submitLocked ? true : this.submitDisabled()}
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

class QuizImpl extends React.Component<Props> {
  state: QuizState = {
    quiz: undefined,
    quizAnswer: undefined,
    userCourseState: undefined,
    submitLocked: false,
    correctCount: null,
    error: undefined,
    userQuizState: undefined,
  }

  async componentDidMount() {
    const { id, languageId, accessToken } = this.props
    //  this.props.setLanguage(languageId)
    try {
      let { quiz, quizAnswer, userQuizState } = await getQuizInfo(
        id,
        languageId,
        accessToken,
      )

      if (!quizAnswer) {
        quizAnswer = {
          quizId: quiz.id,
          languageId,
          itemAnswers: quiz.items.map(item => {
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
        userQuizState,
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

  handleSubmit = async () => {
    this.setState({ submitLocked: true })
    const { quiz, quizAnswer, userQuizState } = await postAnswer(
      this.state.quizAnswer,
      this.props.accessToken,
    )

    this.setState({
      quiz,
      quizAnswer,
      userQuizState,
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
        if (!itemAnswer.textData) return false
        const words = wordCount(itemAnswer.textData)
        if (item.minWords && words < item.minWords) return false

        if (item.maxWords && words > item.maxWords) return false
        return true
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
      return undefined
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
                handleCheckboxToggling={this.handleCheckboxToggling(item.id)}
                setUserQuizState={this.setUserQuizState}
              />
            )
          })}
      </React.Fragment>
    )
  }
}

export default FuncQuizImpl
// connect(null, { setLanguage })(
// QuizImpl //)
