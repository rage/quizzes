import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import DragHandleWrapper from "../DragHandleWrapper"

class FinishedMultipleChoiceItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    const item = this.props.items[this.props.order]
    return (
      <Grid
        container={true}
        spacing={16}
        justify="center"
        alignItems="center"
        style={{ marginTop: "2em", marginBottom: "2em" }}
      >
        <DragHandleWrapper>
          <Grid item={true} xs={12} sm={10} lg={8}>
            <Grid
              container={true}
              spacing={16}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} xs={6} md={3} lg={2}>
                <Typography variant="title">{item.texts[0].title}</Typography>
              </Grid>

              <Grid item={true} xs={6} md={9} lg={10}>
                <Grid
                  container={true}
                  justify="flex-start"
                  alignItems="center"
                  spacing={16}
                >
                  {item.options.map(opt => (
                    <Grid
                      item={true}
                      xs="auto"
                      key={item.id + opt.order}
                      style={{ textAlign: "center" }}
                    >
                      <Button
                        variant="outlined"
                        disabled={true}
                        style={{
                          borderColor: opt.correct ? "green" : "red",
                          textTransform: "none",
                          color: "black",
                        }}
                      >
                        {opt.texts[0].title}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item={true} xs={1}>
            <IconButton
              aria-label="Add option"
              color="primary"
              disableRipple={true}
              onClick={this.props.toggleExpand}
            >
              <Create fontSize="large" nativeColor="#B5B5B5" />
            </IconButton>
          </Grid>
        </DragHandleWrapper>
      </Grid>
    )
  }
}

export default FinishedMultipleChoiceItem
