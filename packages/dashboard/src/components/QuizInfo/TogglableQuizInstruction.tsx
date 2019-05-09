import { Grid, IconButton, Paper, Typography } from "@material-ui/core"
import ArrowDropUp from "@material-ui/icons/ArrowDropUp"
import MoreVert from "@material-ui/icons/MoreVert"
import React from "react"

class TogglableQuizInstruction extends React.Component<any, any> {
  public constructor({ props }) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    if (!this.props.bodyText) {
      return <div />
    }
    let content = this.props.bodyText

    if (this.state.expanded) {
      return (
        <Paper style={{ padding: "2em 1em 2em 1em" }}>
          <Grid container={true} justify="center">
            <Grid item={true} xs={12}>
              <Typography
                variant="body1"
                paragraph={true}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {content}
              </Typography>
            </Grid>
            <Grid item={true} xs={6} sm={4} md={2}>
              <IconButton onClick={this.toggleExpansion}>
                <ArrowDropUp fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      )
    }

    const lines: string[] = this.props.bodyText.split("\n")
    if (lines.length > 16) {
      content = lines.splice(0, 15).join("\n")
    }

    return (
      <Paper style={{ padding: "2em 1em 2em 1em" }}>
        <Grid container={true} justify="center">
          <Grid item={true} xs={12}>
            <Typography
              variant="body1"
              paragraph={true}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {content}
            </Typography>
          </Grid>
          {lines.length > 16 && (
            <Grid item={true} xs={6} sm={4} md={2}>
              <IconButton onClick={this.toggleExpansion}>
                <MoreVert fontSize="large" />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    )
  }

  private toggleExpansion = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }
}

export default TogglableQuizInstruction
