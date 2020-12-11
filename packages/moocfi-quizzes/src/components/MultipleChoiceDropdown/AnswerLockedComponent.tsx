import React from "react"
import { QuizItemOption } from "../../modelTypes"
import { useTypedSelector } from "../../state/store"

interface Props {
  options: QuizItemOption[]
  quizItemId: string
}

const AnswerLockedComponent = ({ options, quizItemId }: Props) => {
  const quizItemAnswer = useTypedSelector(state =>
    state.quizAnswer.quizAnswer.itemAnswers.find(
      o => o.quizItemId === quizItemId,
    ),
  )
  const correctOption = options.find(o => o.correct)
  const answeredCorrectly = quizItemAnswer?.optionAnswers.find(
    oa => correctOption && correctOption.id == oa.quizOptionId,
  )
  // This assumes only one can be selected
  const selectedOptionId = (quizItemAnswer?.optionAnswers.map(
    oa => oa.quizOptionId,
  ) || [])[0]
  const selectedOption = useTypedSelector(state =>
    state.quiz?.items
      .find(o => o.id === quizItemId)
      ?.options.find(o => selectedOptionId && o.id === selectedOptionId),
  )

  if (!correctOption) {
    return <div>Question has no correct option</div>
  }
  if (!quizItemAnswer) {
    return (
      <div>
        Nothing selected on this question. Maybe this was added after your
        answer?
      </div>
    )
  }

  if (answeredCorrectly) {
    return <div>{correctOption.title}</div>
  }
  return (
    <>
      <div>You chose: {selectedOption?.title || "unknown"}</div>
      <div>Correct: {correctOption.title}</div>
    </>
  )
}

export default AnswerLockedComponent
