import { Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"

class AnswerView extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {}

  public render() {
    return (
      <Grid item={true} xs={12} lg={10}>
        <Grid container={true} justify="center">
          {this.props.peerReviews.map((pr, idx) => {
            return (
              <Grid
                item={true}
                xs={12}
                style={{ backgroundColor: "silver" }}
                key={idx}
              >
                Vertaisarvio no {idx + 1}
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    peerReviews: state.peerReviews,
  }
}

export default connect(
  mapStateToProps,
  null,
)(AnswerView)
