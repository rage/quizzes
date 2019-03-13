import React from "react"
import { Checkbox, Grid } from "@material-ui/core"

const CheckboxWidget = ({
  answered,
  options,
  optionAnswers,
  handleOptionChange,
}) => {
  const handleChecking = handleOptionChange(options[0])
  const handleUnchecking = handleOptionChange(-1)

  const toggle = () => {
    if (!optionAnswers[0]) {
      handleChecking()
    } else {
      handleUnchecking()
    }
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        {answered ? (
          //value given so component remains controlled -> no error message in console
          <Checkbox value={`${answered}`} disabled checked />
        ) : (
          <Checkbox
            value={optionAnswers[0] && `${optionAnswers[0].quizOptionId}`}
            onChange={toggle}
            color="primary"
          />
        )}
      </Grid>
      <Grid item style={{ alignSelf: "center" }} xs>
        {options[0].texts[0].title}
      </Grid>
    </Grid>
  )
}

export default CheckboxWidget
