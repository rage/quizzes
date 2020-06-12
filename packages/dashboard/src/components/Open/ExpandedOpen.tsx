import { Card, CardContent, Grid, TextField } from "@material-ui/core"
import green from "@material-ui/core/colors/green"
import red from "@material-ui/core/colors/red"
import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  Theme,
  withStyles,
} from "@material-ui/core/styles"
import React from "react"
import { connect } from "react-redux"
import { changeAttr } from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing(),
    },
  })

const greenTheme = createMuiTheme({
  palette: {
    primary: green,
  },
})

const redTheme = createMuiTheme({
  palette: {
    primary: red,
  },
})

class ExpandedOpen extends React.Component<any, any> {
  public render() {
    const item = this.props.items[this.props.order]

    return (
      <Grid container={true} spacing={3} justify="center" alignItems="center">
        <Grid item={true} xs={12}>
          <Card>
            <Grid container={true} justify="flex-end" alignItems="center">
              <Grid item={true} xs={12}>
                <CardContent>
                  <Grid
                    container={true}
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={8}
                  >
                    <ExpandedTopInformation type={this.props.type} />

                    <Grid item={true} xs={12}>
                      <Grid
                        container={true}
                        spacing={8}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item={true} xs={12}>
                          <TextField
                            fullWidth={true}
                            multiline={true}
                            label="Title"
                            value={item.texts[0].title || ""}
                            onChange={this.changeTempAttribute("title")}
                            style={{
                              fontWeight: "bold",
                              margin: "2em 0em 2em 0em",
                            }}
                          />
                        </Grid>

                        <Grid item={true} xs={12}>
                          <TextField
                            fullWidth={true}
                            multiline={true}
                            rows={
                              item.texts[0].body && item.texts[0].body > 0
                                ? 3
                                : 1
                            }
                            label="Body"
                            value={item.texts[0].body || ""}
                            onChange={this.changeTempAttribute("body")}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item={true} xs={12}>
                      <Grid
                        container={true}
                        spacing={5}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item={true} xs={12}>
                          <TextField
                            variant="outlined"
                            fullWidth={true}
                            required={true}
                            label="Validity regex"
                            value={item.validityRegex || ""}
                            onChange={this.changeTempAttribute("validityRegex")}
                          />
                        </Grid>

                        <Grid item={true} xs={10} lg={6}>
                          <MuiThemeProvider theme={greenTheme}>
                            <TextField
                              className={this.props.classes.margin}
                              multiline={true}
                              fullWidth={true}
                              label="Success message"
                              value={item.texts[0].successMessage || ""}
                              onChange={this.changeTempAttribute(
                                "successMessage",
                              )}
                              variant="outlined"
                            />
                          </MuiThemeProvider>
                        </Grid>

                        <Grid item={true} xs={10} lg={6}>
                          <MuiThemeProvider theme={redTheme}>
                            <TextField
                              className={this.props.classes.margin}
                              fullWidth={true}
                              multiline={true}
                              label="Failure message"
                              value={item.texts[0].failureMessage || ""}
                              onChange={this.changeTempAttribute(
                                "failureMessage",
                              )}
                              variant="outlined"
                            />
                          </MuiThemeProvider>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
              <Grid item={true} xs="auto" />

              <BottomActionsExpItem
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => (e) => {
    const value = e.target.value

    if (attributeName === "validityRegex") {
      this.props.changeAttr(
        `items[${this.props.order}].${attributeName}`,
        value,
      )
    } else {
      this.props.changeAttr(
        `items[${this.props.order}].texts[0].${attributeName}`,
        value,
      )
    }
  }
}

export default withStyles(styles)(connect(null, { changeAttr })(ExpandedOpen))
