import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { setQuiz } from "../../store/filter/actions"

class PeerReviewsView extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    const answer = this.props.answers.find(
      a => a.id === this.props.match.params.id,
    )
    this.props.setQuiz(answer.quizId)
  }

  public render() {
    return (
      <Grid item={true} xs={12} lg={10}>
        <Grid container={true} justify="center">
          <Grid item={true} xs="auto">
            <Typography variant="title">
              The place for peer reviews is here
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    answers: state.answers,
  }
}

export default connect(
  mapStateToProps,
  { setQuiz },
)(PeerReviewsView)
