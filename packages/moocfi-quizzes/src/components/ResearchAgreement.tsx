import * as React from "react"
import CheckboxOption from "./CheckboxOption"
import { QuizItem } from "../modelTypes"
import { useTypedSelector } from "../state/store"
import LaterQuizItemAddition from "./LaterQuizItemAddition"

type ResearchAgreementProps = {
  item: QuizItem
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  item,
}) => {
  const options = item.options
  const quizAnswer = useTypedSelector((state) => state.quizAnswer)
  const itemAnswer = quizAnswer.quizAnswer.itemAnswers.find(
    (ia) => ia.quizItemId === item.id,
  )
  const quizDisabled = useTypedSelector(
    (state) => state.quizAnswer.quizDisabled,
  )

  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  return (
    <>
      {options.map((option) => {
        return <CheckboxOption key={option.id} item={item} />
      })}
    </>
  )
}

export default ResearchAgreement
