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
    itemBody,
    multi,
    options,
    optionAnswers,
    singleItem,
    successMessage,
  } = props

  let direction = "row"
  let questionWidth = 6
  let optionContainerWidth = 6
  let optionWidth

  if (singleItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
    const width =
      maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
    optionContainerWidth = 12
    optionWidth = Math.min(width, 12)
    questionWidth = 12
    direction = "column"
  }

  return (
    <Grid container direction={direction} style={{ marginBottom: 10 }}>
      <Grid item sm={questionWidth}>
        {singleItem ? (
          ""
        ) : (
          <React.Fragment>
            <Typography variant="h6" style={{ paddingBottom: 10 }}>
              {itemTitle}
            </Typography>
            {itemBody && (
              <Typography
                variant="body1"
                style={{ paddingBottom: 10 }}
                dangerouslySetInnerHTML={{ __html: itemBody }}
              />
            )}
          </React.Fragment>
        )}
        {multi && !answered ? (
          <Typography variant="subtitle1">
            Valitse kaikki sopivat vaihtoehdot
          </Typography>
        ) : (
          ""
        )}
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
      <Grid
        item
        sm={optionContainerWidth}
        container
        direction={direction}
        justify="space-between"
        style={{ paddingTop: 7, flexWrap: singleItem ? "nowrap" : "wrap" }}
      >
        {options.map(option => {
          const selected = optionAnswers.find(
            oa => oa.quizOptionId === option.id,
          )
          const text = option.texts[0]
          const feedbackMessage = option.correct
            ? selected
              ? text.successMessage
              : text.failureMessage
            : selected
            ? text.failureMessage
            : text.successMessage
          const feedbackColor = option.correct
            ? selected
              ? "green"
              : "white"
            : selected
            ? "red"
            : "white"
          return answered ? (
            singleItem ? (
              <Grid item container direction={direction} key={option.id}>
                <Grid item sm={optionWidth}>
                  <Button
                    fullWidth
                    color="inherit"
                    {...selectButtonStyle(selected, option.correct)}
                  >
                    {text.title}
                  </Button>
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    style={{
                      borderLeft: `4px solid ${feedbackColor}`,
                      padding: 3,
                      marginBottom: 5,
                    }}
                  >
                    {feedbackMessage}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid item>
                <Button
                  fullWidth
                  color="inherit"
                  {...selectButtonStyle(selected, option.correct)}
                >
                  {text.title}
                </Button>
              </Grid>
            )
          ) : (
            <Grid item sm={optionWidth} key={option.id}>
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
          )
        })}
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
