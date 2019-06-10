import { Grid, RootRef, Typography } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"
import Answer from "./Answer"
import PageSelector from "./PageSelector"

class AttentionAnswers extends React.Component<any, any> {
  private upperNavigationRef: React.RefObject<HTMLElement>

  constructor(props) {
    super(props)
    this.upperNavigationRef = React.createRef<HTMLElement>()
  }

  public render() {
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
            {this.props.showingAll
              ? "ALL ANSWERS"
              : "ANSWERS REQUIRING ATTENTION"}
          </Typography>
        </Grid>
        <Grid item={true} xs={4}>
          {this.props.showingAll ? (
            <Link to={`/quizzes/${this.props.quiz.id}/answers`}>
              <Typography color="textPrimary">
                VIEW ANSWERS REQUIRING ATTENTION
              </Typography>
            </Link>
          ) : (
            <Link to={`/quizzes/${this.props.quiz.id}/answers?all=true`}>
              <Typography color="textPrimary">VIEW ALL</Typography>
            </Link>
          )}
        </Grid>

        {this.props.answers.length === 0 ? (
          <Grid item={true} xs={12}>
            <Typography variant="subtitle1">No answers</Typography>
          </Grid>
        ) : (
          <React.Fragment>
            <Grid item={true} xs={12}>
              <RootRef rootRef={this.upperNavigationRef}>
                <PageSelector
                  upRef={null}
                  currentPage={this.props.currentPage}
                  totalPages={this.props.totalPages}
                  onPageChange={this.props.onPageChange}
                  resultsPerPage={this.props.resultsPerPage}
                  changeResultsPerPage={this.props.changeResultsPerPage}
                />
              </RootRef>
            </Grid>

            <Grid
              item={true}
              xs="auto"
              style={
                this.props.inWaitingState
                  ? {
                      filter: "opacity(25%)",
                      cursor: "default",
                      pointerEvents: "none",
                    }
                  : {}
              }
            >
              <Grid
                container={true}
                justify="flex-start"
                alignItems="center"
                spacing={24}
              >
                {this.props.answers.map((answer, idx) => {
                  return (
                    <Answer
                      key={answer.id}
                      answerData={answer}
                      peerReviews={answer.peerReviews}
                      idx={idx}
                      quiz={this.props.quiz}
                    />
                  )
                })}
              </Grid>
            </Grid>

            <Grid item={true} xs={12}>
              <PageSelector
                isAtBottom={true}
                upRef={this.upperNavigationRef}
                currentPage={this.props.currentPage}
                totalPages={this.props.totalPages}
                onPageChange={this.props.onPageChange}
                resultsPerPage={this.props.resultsPerPage}
                changeResultsPerPage={this.props.changeResultsPerPage}
              />
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    )
  }
}

export default AttentionAnswers
