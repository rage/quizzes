import { Grid, Typography } from "@material-ui/core"
import React from "react"

const ItemAnswerComponent = ({ answer, idx, quiz }) => {
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
                Question {qIdx}: {qItem.texts[0].title}
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
              {qItem.type === "essay" ? (
                <Typography variant="body1">
                  {answer.itemAnswers[qIdx].textData}
                </Typography>
              ) : (
                "Only essay type supported atm"
              )}
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

export default ItemAnswerComponent
