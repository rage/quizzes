import React from "react"
import { Checkbox, Grid } from "@material-ui/core"
import CheckboxOption from "./Checkbox/CheckboxOption"

const ResearchAgreement = ({
  options,
  optionAnswers,
  item,
  answered,
  handleOptionChange,
}) => {
  console.log("Option answers: ", optionAnswers)

  const toggle = optionId => {
    const oa = optionAnswers.find(oa => oa.quizOptionId === optionId)
    return () => {
      if (!oa) {
        handleOptionChange(optionId, true, true)()
      } else {
        handleOptionChange(optionId, false, true)()
      }
    }
  }

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
            value={currentAnswer ? currentAnswer.quizOptionId : ""}
            toggle={toggle(option.id)}
            answered={answered}
          />
        )
      })}
    </React.Fragment>
  )
}

export default ResearchAgreement
