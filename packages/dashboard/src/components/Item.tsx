import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SvgIcon,
  Switch,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import DragHandleWrapper from "./DragHandleWrapper"
import OptionContainer from "./OptionContainer"

class Item extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  // DISSPLAYNG THE ESSAY: SHOULD BE MORE UNIFORM WITH THE OTHERS!

  public shouldComponentUpdate(nextProps, nextState) {
    if (nextState.expanded !== this.state.expanded) {
      return true
    }
    if (nextProps.title !== this.props.title) {
      return true
    }
    if (nextProps.body !== this.props.body) {
      return true
    }
    if (nextProps.successMessage !== this.props.successMessage) {
      return true
    }
    if (nextProps.failureMessage !== this.props.failureMessage) {
      return true
    }
    if (nextProps.validityRegex !== this.props.validityRegex) {
      return true
    }
    if (nextProps.formatRegex !== this.props.formatRegex) {
      return true
    }
    return false
  }

  public render() {
    // console.log("item")

    const renderOptions = type => {
      return ["multiple-choice", "checkbox", "research-agreement"].includes(
        type,
      )
    }

    console.log("Props: ", this.props)

    return (
      <Card style={{ marginBottom: 20 }}>
        {!this.state.expanded ? (
          <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
            <Grid item={true} xs={11}>
              <DragHandleWrapper>
                <CardHeader
                  title={
                    this.props.title ||
                    this.props.type[0].toUpperCase() + this.props.type.slice(1)
                  }
                  titleTypographyProps={{
                    variant: "subtitle1",
                    gutterBottom: false,
                  }}
                />
              </DragHandleWrapper>
            </Grid>

            <Grid item={true} xs={1}>
              <Grid container={true} justify="flex-end">
                <Grid item={true}>
                  <CardActions>
                    <IconButton onClick={this.handleExpand}>
                      <SvgIcon>
                        <path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" />
                      </SvgIcon>
                    </IconButton>
                  </CardActions>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <p />
        )}

        <Collapse in={this.state.expanded}>
          <CardContent>
            <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
              <Grid item={true} xs={12}>
                <Card>
                  <CardHeader subheader="general" />
                  <CardContent>
                    <TextField
                      label="title"
                      value={this.props.title || undefined}
                      fullWidth={true}
                      onChange={this.props.handleChange(
                        `items[${this.props.index}].texts[${
                          this.props.textIndex
                        }].title`,
                      )}
                      multiline={true}
                      margin="normal"
                    />
                    <TextField
                      label="body"
                      value={this.props.body || undefined}
                      fullWidth={true}
                      onChange={this.props.handleChange(
                        `items[${this.props.index}].texts[${
                          this.props.textIndex
                        }].body`,
                      )}
                      multiline={true}
                      margin="normal"
                    />

                    {this.props.type !== "essay" && (
                      <React.Fragment>
                        <TextField
                          label="success message"
                          value={this.props.successMessage || undefined}
                          fullWidth={true}
                          onChange={this.props.handleChange(
                            `items[${this.props.index}].texts[${
                              this.props.textIndex
                            }].successMessage`,
                          )}
                          multiline={true}
                          margin="normal"
                        />
                        <TextField
                          label="failure message"
                          value={this.props.failureMessage || undefined}
                          fullWidth={true}
                          onChange={this.props.handleChange(
                            `items[${this.props.index}].texts[${
                              this.props.textIndex
                            }].failureMessage`,
                          )}
                          multiline={true}
                          margin="normal"
                        />
                      </React.Fragment>
                    )}
                    {this.props.type === "open" ? (
                      <div>
                        <TextField
                          label="validity regex"
                          fullWidth={true}
                          value={this.props.validityRegex || undefined}
                          onChange={this.props.handleChange(
                            `items[${this.props.index}].validityRegex`,
                          )}
                          margin="normal"
                        />
                        <TextField
                          label="format regex"
                          fullWidth={true}
                          value={this.props.formatRegex || undefined}
                          onChange={this.props.handleChange(
                            `items[${this.props.index}].formatRegex`,
                          )}
                          margin="normal"
                        />
                      </div>
                    ) : (
                      <p />
                    )}
                    <Grid container={true} style={{ marginTop: 20 }}>
                      <Grid item={true} xs={12}>
                        <Grid container={true} justify="flex-end">
                          <IconButton
                            onClick={this.props.remove(
                              "items",
                              this.props.index,
                            )}
                            aria-label="Delete"
                            color="secondary"
                          >
                            <SvgIcon>
                              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                            </SvgIcon>
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              {renderOptions(this.props.type) ? (
                <Grid item={true} xs={12}>
                  <Card>
                    <CardHeader subheader="Options / Answer alternatives" />
                    <CardContent>
                      <OptionContainer
                        axis="xy"
                        onSortEnd={this.props.handleSort}
                        index={this.props.index}
                        useDragHandle={true}
                        language={this.props.language}
                        handleChange={this.props.handleChange}
                        remove={this.props.remove}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <p />
              )}
              <Grid item={true} xs={12}>
                <Grid container={true} justify="flex-end">
                  <Grid item={true}>
                    <CardActions>
                      <IconButton
                        onClick={this.handleExpand}
                        style={{ transform: "rotate(180deg)" }}
                      >
                        <SvgIcon>
                          <path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" />
                        </SvgIcon>
                      </IconButton>
                    </CardActions>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    )
  }

  private handleExpand = event => {
    this.setState({ expanded: !this.state.expanded })
  }
}

export default connect()(Item)
