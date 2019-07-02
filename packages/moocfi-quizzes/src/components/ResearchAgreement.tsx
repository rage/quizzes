import * as React from "react"
import CheckboxOption from "./CheckboxOption"
import { QuizItem } from "../state/quiz/reducer"
import { useTypedSelector } from "../state/store"

type ResearchAgreementProps = {
  item: QuizItem
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  item,
}) => {
  const itemAnswers = useTypedSelector(state => state.quizAnswer.itemAnswers)
  const optionAnswers = itemAnswers.find(ia => ia.quizItemId === item.id)
    .optionAnswers
  const options = item.options

  return (
    <>
      {options.map(option => {
        return (
          <CheckboxOption
            key={option.id}
            item={item}
            optionAnswers={optionAnswers}
          />
        )
      })}
    </>
  )
}

export default ResearchAgreement
