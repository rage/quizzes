import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core"
import AddCircle from "@material-ui/icons/AddCircle"
import Reorder from "@material-ui/icons/Reorder"
import React from "react"
import { connect } from "react-redux"

class MultipleChoiceItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    console.log("Props are: ", this.props)
    return (
      <Grid container={true} justify="center" alignItems="center">
        <Grid item={true} xs={12} sm={10} lg={8}>
          <Card>
            <Grid container={true} justify="flex-end" alignItems="center">
              <Grid item={true} xs={12}>
                <CardContent>
                  <Grid
                    container={true}
                    justify="flex-start"
                    alignItems="center"
                    spacing={8}
                  >
                    <Grid item={true} xs={11}>
                      <Typography color="textSecondary" gutterBottom={true}>
                        Type: multiple choice
                      </Typography>
                    </Grid>
                    <Grid item={true} xs={1}>
                      <Reorder
                        fontSize="large"
                        style={{ transform: "scale(3,1.5)" }}
                      />
                    </Grid>

                    <Grid item={true} xs={6} md={4} lg={3}>
                      <Typography variant="title">
                        {this.props.title}
                      </Typography>
                      <Typography variant="body2">{this.props.body}</Typography>
                    </Grid>
                    <Grid item={true} xs={5} md={7} lg={8}>
                      <Grid
                        container={true}
                        justify="space-around"
                        alignItems="center"
                        spacing={8}
                      >
                        {this.props.options.map(option => {
                          return (
                            <Grid
                              item={true}
                              xs={6}
                              sm={4}
                              lg={3}
                              xl={2}
                              key={option.id}
                            >
                              <Button
                                variant="outlined"
                                style={{
                                  borderColor: option.correct ? "green" : "red",
                                  borderWidth: ".25em",
                                  textTransform: "none",
                                }}
                              >
                                {option.texts[0].title}
                              </Button>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Grid>
                    <Grid item={true} xs={1}>
                      <IconButton
                        aria-label="Add option"
                        color="primary"
                        disableRipple={true}
                      >
                        <AddCircle fontSize="large" nativeColor="#E5E5E5" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item={true} xs="auto" />
              <Grid item={true}>
                <CardActions>
                  <Button
                    style={{
                      backgroundColor: "#00FF19",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#FF1F00",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </Button>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    items: state.edit.items,
  }
}

export default connect(mapStateToProps)(MultipleChoiceItem)
