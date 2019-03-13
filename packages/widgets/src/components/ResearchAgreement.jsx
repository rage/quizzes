import React from "react"
import { Checkbox, Grid } from "@material-ui/core"

const Option = ({ label, value, toggle, answered }) => {
  let checkboxOptions = {
    disabled: answered,
  }
  if (answered) {
    checkboxOptions.checked = true
  }

  return (
    <Grid container style={{ marginBottom: "center" }}>
      <Grid item xs={1}>
        <Checkbox
          value={value}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
        />
      </Grid>
      <Grid item xs style={{ alignSelf: "center" }}>
        {label}
      </Grid>
    </Grid>
  )
}

const ResearchAgreement = ({
  options,
  optionAnswers,
  item,
  answered,
  handleOptionChange,
}) => {
  console.log("Option answers: ", optionAnswers)

  const handleUnchecking = handleOptionChange(-1)

  const toggle = optionId => {
    const oa = optionAnswers.find(oa => oa.quizOptionId === optionId)
    const handleChecking = handleOptionChange(optionId)
    return () => {
      if (!oa) {
        handleChecking()
      } else {
        handleUnchecking()
      }
    }
  }
  ;() => {
    if (!optionAnswers[0]) {
      handleChecking()
    } else {
      handleUnchecking()
    }
  }

  return (
    <React.Fragment>
      {options.map(option => {
        const currentAnswer = optionAnswers.find(
          oa => oa.quizOptionId === option.id,
        )

        return (
          <Option
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
