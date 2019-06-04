import { Button, Grid, Grow, Typography } from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import React from "react"

class QuestionAdder extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
        <Grid container={true} justify="flex-start" alignContent="stretch">
          <NewQuizButton toggleExpand={this.toggleExpand} />

          <Grow in={this.state.expanded} style={{ transformOrigin: "0 0 0" }}>
            <Grid item={true} xs={10} lg={8}>
              <Grid
                container={true}
                justify="flex-start"
                style={{ backgroundColor: "lightgray" }}
              >
                {this.props.itemTypes.map((type, idx) => (
                  <Grid item={true} xs="auto" key={type.value} style={{}}>
                    <Grid container={true} alignItems="center">
                      <Grid item={true} xs={11}>
                        <Button
                          disabled={!this.state.expanded}
                          style={{
                            textTransform: "none",
                            padding: "1em",
                            whiteSpace: "pre-wrap",
                            height: "5em",
                          }}
                          onClick={this.props.addItem(type.value)}
                        >
                          {type.label}
                        </Button>
                      </Grid>

                      {idx < this.props.itemTypes.length - 1 && (
                        <TypeSeparator />
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grow>

          {!this.props.itemsExist && !this.state.expanded && (
            <Grid
              item={true}
              xs={10}
              sm={8}
              md={6}
              lg={4}
              xl={3}
              style={{
                alignSelf: "center",
              }}
            >
              <Typography variant="body1" style={{ color: "darkgray" }}>
                Your Quiz does not have any questions yet. Add a question by
                clicking the button on the left.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    )
  }

  private toggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }
}

const NewQuizButton = ({ toggleExpand }) => (
  <Grid
    item={true}
    xs="auto"
    onClick={toggleExpand}
    style={{
      backgroundColor: "darkgray",
      cursor: "pointer",
      width: "5em",
    }}
  >
    <Grid
      container={true}
      direction="column"
      justify="center"
      alignContent="center"
      style={{ height: "100%" }}
    >
      <Grid item={true} xs={6}>
        <Add
          fontSize="large"
          style={{ color: "white", width: "100%", height: "100%" }}
        />
      </Grid>
    </Grid>
  </Grid>
)

const TypeSeparator = () => (
  <Grid item={true} xs={1}>
    <Typography
      align="center"
      variant="h3"
      style={{ display: "inline", color: "silver" }}
    >
      |
    </Typography>
  </Grid>
)

export default QuestionAdder
