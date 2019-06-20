import * as React from "react"
import CheckboxOption from "./CheckboxOption"

export default ({
  answered,
  options,
  optionAnswers,
  handleCheckboxToggling,
}) => {
  return (
    <CheckboxOption
      title={options[0].texts[0].title}
      body={options[0].texts[0].title}
      value={optionAnswers[0]}
      toggle={handleCheckboxToggling(options[0].id)}
      answered={answered}
    />
  )
}
