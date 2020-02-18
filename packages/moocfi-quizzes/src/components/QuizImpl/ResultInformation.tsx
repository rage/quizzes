import * as React from "react"
import { Typography } from "@material-ui/core"
import { Quiz, QuizItemAnswer, QuizAnswer } from "../../modelTypes"
import { GeneralLabels } from "../../utils/languages"

type ResultInformationProps = {
  quiz: Quiz
  quizAnswer: QuizAnswer
  generalLabels: GeneralLabels
}

const ResultInformation: React.FunctionComponent<ResultInformationProps> = ({
  quiz,
  quizAnswer,
  generalLabels,
}) => {
  const hasCorrectAnswer = (quiz: Quiz) => {
    return quiz.items.some(
      item =>
        item.type === "essay" ||
        item.type === "multiple-choice" ||
        item.type === "open",
    )
  }

  const atLeastOneCorrect = (itemAnswers: QuizItemAnswer[]) =>
    itemAnswers.some(ia => ia.correct === true)

  const types = quiz.items.map(item => item.type)

  let feedback: string | undefined = undefined

  if (!hasCorrectAnswer(quiz)) {
    feedback = generalLabels.alreadyAnsweredLabel
  }

  if (feedback === undefined && !atLeastOneCorrect(quizAnswer.itemAnswers)) {
    feedback =
      types.includes("essay") || types.includes("scale")
        ? ""
        : generalLabels.answerIncorrectLabel
  }

  const quizItems = quiz.items
  const numberOfNotIncorrectAnswers = quizAnswer.itemAnswers.filter(ia => {
    if (ia.correct === true) return true
    const item = quizItems.find(i => i.id === ia.quizItemId)
    return (
      item &&
      (item.type === "checkbox" ||
        item.type === "feedback" ||
        item.type === "scale" ||
        item.type === "research-agreement")
    )
  }).length

  if (feedback === undefined) {
    feedback =
      quiz.items.length === 1
        ? generalLabels.answerCorrectLabel
        : generalLabels.kOutOfNCorrect(
            numberOfNotIncorrectAnswers,
            quiz.items.length,
          )
  }

  return <Typography component="p" variant="h5">{feedback}</Typography>
}

export default ResultInformation
