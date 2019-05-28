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
import { changeAttr, save } from "../../store/edit/actions"
import BottomActionsExpItem from "../ItemTools/ExpandedBottomActions"
import ExpandedTopInformation from "../ItemTools/ExpandedTopInformation"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing.unit,
    },
  })

const greenTheme = createMuiTheme({
  palette: {
    primary: green,
  },
  typography: { useNextVariants: true },
})

const redTheme = createMuiTheme({
  palette: {
    primary: red,
  },
  typography: { useNextVariants: true },
})

class ExpandedOpen extends React.Component<any, any> {
  constructor(props) {
    super(props)
    const item = this.props.items[this.props.order]
    const initData = {
      title: item.texts[0].title,
      body: item.texts[0].body,
      validityRegex: item.validityRegex,
      successMessage: item.texts[0].successMessage,
      failureMessage: item.texts[0].failureMessage,
    }
    this.state = {
      tempItemData: initData,
      titleHasBeenModified: item.id ? true : false,
    }
  }

  public render() {
    const item = this.props.items[this.props.order]

    return (
      <Grid container={true} spacing={16} justify="center" alignItems="center">
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
                            value={
                              (this.state.titleHasBeenModified &&
                                this.state.tempItemData.title) ||
                              ""
                            }
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
                              this.state.tempItemData.body &&
                              this.state.tempItemData.body.length > 0
                                ? 3
                                : 1
                            }
                            label="Body"
                            value={this.state.tempItemData.body || ""}
                            onChange={this.changeTempAttribute("body")}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item={true} xs={12}>
                      <Grid
                        container={true}
                        spacing={24}
                        justify="flex-start"
                        alignItems="center"
                      >
                        <Grid item={true} xs={12}>
                          <TextField
                            variant="outlined"
                            fullWidth={true}
                            required={true}
                            label="Validity regex"
                            value={this.state.tempItemData.validityRegex || ""}
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
                              value={
                                this.state.tempItemData.successMessage || ""
                              }
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
                              value={
                                this.state.tempItemData.failureMessage || ""
                              }
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
                onSave={this.saveItem}
                itemHasBeenSaved={item.id ? true : false}
                handleExpand={this.props.toggleExpand}
                handleCancel={this.props.onCancel}
                index={this.props.order}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const newData = { ...this.state.tempItemData }
    newData[attributeName] = e.target.value

    if (attributeName === "title") {
      this.setState({
        titleHasBeenModified: true,
        tempItemData: newData,
      })
    } else {
      this.setState({
        tempItemData: newData,
      })
    }
  }

  private saveItem = e => {
    this.props.toggleExpand(e)
    this.props.changeAttr(
      `items[${this.props.order}].texts[0].title`,
      this.state.tempItemData.title,
    )

    this.props.changeAttr(
      `items[${this.props.order}].texts[0].body`,
      this.state.tempItemData.body,
    )

    this.props.changeAttr(
      `items[${this.props.order}].texts[0].successMessage`,
      this.state.tempItemData.successMessage,
    )

    this.props.changeAttr(
      `items[${this.props.order}].texts[0].failureMessage`,
      this.state.tempItemData.failureMessage,
    )

    this.props.changeAttr(
      `items[${this.props.order}].validityRegex`,
      this.state.tempItemData.validityRegex,
    )

    this.props.save()
  }
}

export default withStyles(styles)(
  connect(
    null,
    { changeAttr, save },
  )(ExpandedOpen),
)
