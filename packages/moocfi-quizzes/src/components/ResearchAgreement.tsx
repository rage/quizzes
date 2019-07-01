import * as React from "react"
import CheckboxOption from "./CheckboxOption"
import { QuizItem } from "../state/quiz/reducer"
import { QuizOptionAnswer } from "../state/quizAnswer/reducer"

type ResearchAgreementProps = {
  optionAnswers: QuizOptionAnswer[]
  item: QuizItem
  handleCheckboxToggling: (optionId: string) => () => any
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  item,
  optionAnswers,
  handleCheckboxToggling,
}) => {
  const options = item.options

  return (
    <>
      {options.map(option => {
        return (
          <CheckboxOption
            key={option.id}
            handleCheckboxToggling={handleCheckboxToggling(option.id)}
            item={item}
            optionAnswers={optionAnswers}
          />
        )
      })}
    </>
  )
}

export default ResearchAgreement
