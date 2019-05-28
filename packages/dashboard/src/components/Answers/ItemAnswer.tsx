import { Grid, Typography } from "@material-ui/core"
import React from "react"

const ItemAnswer = ({ answer, idx, quiz }) => {
  return (
    <Grid
      container={true}
      alignItems="flex-start"
      style={{
        marginLeft: ".5em",
      }}
    >
      {quiz.items.map((qItem, qIdx) => {
        const isFirst = qIdx === 0
        const isLast = qIdx === quiz.items.length - 1

        return (
          <React.Fragment key={qItem.id}>
            <Grid item={true} xs={12} md={8}>
              <Typography variant="subtitle1">
                Question {qIdx}: {qItem.texts[0].title}{" "}
                {qItem.type === "scale" &&
                  `[${qItem.minValue || 1}-${qItem.maxValue || 7}]`}
              </Typography>
            </Grid>

            <Grid item={true} xs={6} md={2}>
              <Typography variant="body1" style={{ color: "#9D9696" }}>
                Type: {qItem.type}
              </Typography>
            </Grid>

            {isFirst && (
              <Grid item={true} xs={6} md={2} style={{ textAlign: "center" }}>
                <Typography variant="body1">0 / {quiz.items.length}</Typography>
              </Grid>
            )}

            <Grid item={true} xs={12} md={10} style={{ marginTop: "1em" }}>
              <ItemAnswerContent
                type={qItem.type}
                item={qItem}
                answer={answer.itemAnswers.find(a => a.quizItemId === qItem.id)}
              />
            </Grid>

            <Grid
              item={true}
              xs={12}
              style={{
                borderBottom: isLast ? "none" : "1px dashed #9D9696",
                margin: ".5em 0em .5em 0em",
              }}
            />
          </React.Fragment>
        )
      })}
    </Grid>
  )
}

const ItemAnswerContent = ({ answer, type, item }) => {
  if (!answer) {
    return (
      <Typography variant="button">
        No answer - quiz probably modified after answering
      </Typography>
    )
  }
  switch (type) {
    case "essay":
      return (
        <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
          {answer.textData}
        </Typography>
      )
    case "multiple-choice":
      const optionAnswerId =
        answer &&
        answer.optionAnswers[0] &&
        answer.optionAnswers[0].quizOptionId
      const optionsData = item.options.map(opt => ({
        id: opt.id,
        correct: opt.correct,
        title: opt.texts[0].title,
      }))
      const correctOptions = optionsData.filter(opt => opt.correct)

      const chosen = optionsData.find(opt => opt.id === optionAnswerId)

      return (
        <React.Fragment>
          <Typography variant="body1">
            Correct option{correctOptions.length > 0 ? "s" : ""} :
            <span style={{ fontWeight: "bold" }}>
              {correctOptions.map(opt => opt.title)}
            </span>
          </Typography>
          <Typography variant="body1">
            Chosen answer:
            <span style={{ color: chosen && chosen.correct ? "green" : "red" }}>
              {chosen ? chosen.title : ""}
            </span>
          </Typography>
        </React.Fragment>
      )
    case "open":
      return (
        <React.Fragment>
          <Typography variant="body1">
            Accepted form:{" "}
            {<span style={{ fontWeight: "bold" }}> {item.validityRegex} </span>}
          </Typography>
          <Typography variant="body1">
            Answer:{" "}
            {answer.correct !== null ? (
              <span style={{ color: answer.correct ? "green" : "red" }}>
                {answer.textData}
              </span>
            ) : (
              answer.textData
            )}
          </Typography>
        </React.Fragment>
      )

    case "scale":
      return <Typography variant="body1">Answer: {answer.intData}</Typography>
    case "checkbox":
    case "research-agreement":
      return (
        <React.Fragment>
          {item.options.map(opt => {
            if (answer.optionAnswers.length === 0) {
              return (
                <Typography key={opt.id}>
                  {opt.texts[0].title}: No option answers - probably deprecated
                </Typography>
              )
            }
            const checked = answer.optionAnswers.some(
              ao => ao.quizOptionId === opt.id,
            )

            return (
              <Typography key={opt.id}>
                {opt.texts[0].title}: {checked ? "Checked" : "Left unchecked"}
              </Typography>
            )
          })}
        </React.Fragment>
      )

    default:
      return (
        <Typography variant="subtitle1">Unknown / unsupported type</Typography>
      )
  }
}

export default ItemAnswer
