import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"
import Answer from "./Answer"

const AttentionAnswers = ({ answers, quiz, showingAll }) => {
  return (
    <Grid
      container={true}
      justify="flex-start"
      alignItems="center"
      spacing={24}
    >
      <Grid
        item={true}
        xs={8}
        style={{ marginBottom: "1em", textAlign: "center" }}
      >
        <Typography variant="title">
          {showingAll ? "ALL ANSWERS" : "ANSWERS REQUIRING ATTENTION"}
        </Typography>
      </Grid>
      <Grid item={true} xs={4}>
        {showingAll ? (
          <Link to={`/quizzes/${quiz.id}/answers`}>
            <Typography color="textPrimary">
              VIEW ANSWERS REQUIRING ATTENTION
            </Typography>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz.id}/answers?all=true`}>
            <Typography color="textPrimary">VIEW ALL</Typography>
          </Link>
        )}
      </Grid>

      {answers.map((answer, idx) => {
        return (
          <Answer
            key={answer.id}
            answerData={answer}
            peerReviews={answer.peerReviews}
            idx={idx}
            quiz={quiz}
          />
        )
      })}
    </Grid>
  )
}

export default AttentionAnswers
