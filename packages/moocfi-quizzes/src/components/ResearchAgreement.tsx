import * as React from "react"
import CheckboxOption from "./Checkbox/CheckboxOption"

type ResearchAgreementProps = {
  options: any[]
  optionAnswers: any[]
  answered: boolean
  handleCheckboxToggling: (any) => any
}

const ResearchAgreement: React.FunctionComponent<ResearchAgreementProps> = ({
  options,
  optionAnswers,
  answered,
  handleCheckboxToggling,
}) => {
  return (
    <>
      {options.map(option => {
        const currentAnswer = optionAnswers.find(
          oa => oa.quizOptionId === option.id,
        )

        return (
          <CheckboxOption
            key={option.id}
            title={option.texts[0].title}
            body={option.texts[0].body}
            value={currentAnswer}
            toggle={handleCheckboxToggling(option.id)}
            answered={answered}
          />
        )
      })}
    </>
  )
}

export default ResearchAgreement
