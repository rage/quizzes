import React from "react"
import CheckboxOption from "./CheckboxOption"

export default ({
  answered,
  options,
  optionAnswers,
  handleCheckboxToggling,
}) => {
  return (
    <CheckboxOption
      label={options[0].texts[0].title}
      value={optionAnswers[0] ? optionAnswers[0].quizOptionId : ""}
      toggle={handleCheckboxToggling(options[0].id)}
      answered={answered}
    />
  )
}
