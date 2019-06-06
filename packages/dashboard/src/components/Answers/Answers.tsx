import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"
import Answer from "./Answer"
import PageSelector from "./PageSelector"

const AttentionAnswers = ({
  answers,
  quiz,
  showingAll,
  currentPage,
  totalPages,
  onPageChange,
}) => {
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

      {answers.length === 0 ? (
        <Grid item={true} xs={12}>
          <Typography variant="subtitle1">No answers</Typography>
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item={true} xs="auto">
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
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

          <Grid item={true} xs="auto">
            <PageSelector
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  )
}

export default AttentionAnswers
