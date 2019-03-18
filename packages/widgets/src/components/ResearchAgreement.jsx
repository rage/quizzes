import React from "react"
import CheckboxOption from "./Checkbox/CheckboxOption"

const ResearchAgreement = ({
  options,
  optionAnswers,
  answered,
  handleCheckboxToggling,
}) => {
  return (
    <React.Fragment>
      {options.map(option => {
        const currentAnswer = optionAnswers.find(
          oa => oa.quizOptionId === option.id,
        )

        return (
          <CheckboxOption
            key={option.id}
            label={option.texts[0].title}
            value={currentAnswer}
            toggle={handleCheckboxToggling(option.id)}
            answered={answered}
          />
        )
      })}
    </React.Fragment>
  )
}

export default ResearchAgreement
