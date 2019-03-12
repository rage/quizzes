import React from "react"
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core"

export default props => {
  const {
    answered,
    correct,
    failureMessage,
    handleOptionChange,
    itemTitle,
    options,
    optionAnswers,
    singleItem,
    successMessage,
  } = props

  let direction = "row"
  let questionWidth = 5
  let optionContainerWidth = 7

  const feedbackMessageExists = () => {
    return failureMessage || successMessage
  }

  if (singleItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
    const width =
      maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
    optionContainerWidth = Math.min(width, 12)
    questionWidth = 12
    direction = "column"
  }

  return (
    <Grid container direction={direction} style={{ marginBottom: 10 }}>
      <Grid item sm={questionWidth}>
        <Typography variant="subtitle1">{itemTitle}</Typography>
        {answered && !singleItem ? (
          <Typography
            variant="body1"
            style={{
              borderLeft: `4px solid ${correct ? "green" : "red"}`,
              padding: 3,
            }}
          >
            {correct ? successMessage : failureMessage}
          </Typography>
        ) : (
          ""
        )}
      </Grid>
      <Grid item sm={optionContainerWidth}>
        <Grid
          container
          direction={direction}
          justify="space-evenly"
          style={{ paddingTop: 7 }}
        >
          {options.map(option => {
            const selected = optionAnswers.find(
              oa => oa.quizOptionId === option.id,
            )
            const text = option.texts[0]
            const submittedColor = option.correct
              ? selected
                ? "green"
                : "white"
              : selected
              ? "red"
              : "white"
            return (
              <Grid item key={option.id}>
                {answered ? (
                  <Grid item key={option.id}>
                    <Button
                      fullWidth
                      color="inherit"
                      {...selectButtonStyle(selected, option.correct)}
                    >
                      {text.title}
                    </Button>
                    {singleItem && feedbackMessageExists() ? (
                      <Typography
                        variant="body1"
                        style={{
                          borderLeft: `4px solid ${submittedColor}`,
                          padding: 3,
                          marginBottom: 5,
                        }}
                      >
                        {option.correct
                          ? selected
                            ? text.successMessage
                            : text.failureMessage
                          : selected
                          ? text.failureMessage
                          : text.successMessage}
                      </Typography>
                    ) : (
                      ""
                    )}
                  </Grid>
                ) : (
                  <Grid item key={option.id}>
                    <Button
                      variant="outlined"
                      fullWidth
                      color={selected ? "primary" : "default"}
                      style={{ textTransform: "none", margin: "0.5em 0" }}
                      onClick={handleOptionChange(option.id)}
                    >
                      {text.title}
                    </Button>
                  </Grid>
                )}
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

const selectButtonStyle = (selected, correct) => {
  const style = { textTransform: "none", margin: "0.5em 0" }
  return {
    variant: selected ? "contained" : "outlined",
    style: selected
      ? correct
        ? { ...style, ...{ color: "white", backgroundColor: "green" } }
        : { ...style, ...{ color: "white", backgroundColor: "red" } }
      : correct
      ? { ...style, ...{ color: "green", outlineColor: "green" } }
      : style,
  }
}
