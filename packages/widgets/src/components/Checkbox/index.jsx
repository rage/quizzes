import React from "react"
import CheckboxOption from "./CheckboxOption"

export default ({ answered, options, optionAnswers, handleOptionChange }) => {
  const handleChecking = handleOptionChange(options[0])
  const handleUnchecking = handleOptionChange(options[0], false)

  const toggle = () => {
    if (!optionAnswers[0]) {
      handleChecking()
    } else {
      handleUnchecking()
    }
  }

  return (
    <CheckboxOption
      label={options[0].texts[0].title}
      value={optionAnswers[0] ? optionAnswers[0].quizOptionId : ""}
      toggle={toggle}
      answered={answered}
    />
  )
}
