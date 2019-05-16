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
import Delete from "@material-ui/icons/Delete"
import React, { ChangeEvent, createRef } from "react"
import { connect } from "react-redux"
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc"
import { executeIfOnlyDigitsInTextField } from "../../../common/src/util/index"
import {
  addItem,
  addOption,
  changeAttr,
  changeOrder,
  newQuiz,
  remove,
  save,
  setEdit,
} from "../store/edit/actions"
import Checkbox from "./Checkbox"
import DragHandleWrapper from "./DragHandleWrapper"
import EssayItem from "./Essay"
import MultipleChoiceItem from "./MultipleChoice"
import OptionContainer from "./OptionContainer"
import ResearchAgreement from "./ResearchAgreement"
import ScaleItem from "./Scale"

class Item extends React.Component<any, any> {
  private titleRef = createRef<HTMLInputElement>()

  constructor(props) {
    super(props)
    this.state = {
      expandedOptions: {},
    }
  }

  // DISSPLAYNG THE ESSAY: SHOULD BE MORE UNIFORM WITH THE OTHERS!

  public expandOption = (order: number) => {
    const newExpList: boolean[] = { ...this.state.expandedOptions }
    newExpList[order] = !newExpList[order]
    this.setState({
      expandedOptions: newExpList,
    })
  }

  public componentDidMount() {
    if (this.props.newlyAdded) {
      this.props.scrollToNew(this.titleRef.current)
      this.props.expandItem(this.props.order)
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (nextState.expandedOptions !== this.state.expandedOptions) {
      return true
    }
    if (nextProps.expanded !== this.props.expanded) {
      return true
    }

    const modificationFields: string[] = [
      "title",
      "body",
      "minWords",
      "maxWords",
      "successMessage",
      "failureMessage",
      "validityRegex",
      "formatRegex",
      "newlyAdded",
      "expanded",
      "order",
      "items",
    ]

    return modificationFields.some(
      fieldName => nextProps[fieldName] !== this.props[fieldName],
    )
  }

  public render() {
    const renderOptions = type => {
      return ["multiple-choice", "checkbox", "research-agreement"].includes(
        type,
      )
    }

    if (this.props.type === "multiple-choice") {
      return (
        <MultipleChoiceItem
          {...this.props}
          onCancel={this.handleItemCancel(this.props.order)}
          toggleExpand={this.toggleExpand}
          onRemoval={this.handleItemRemoval}
        />
      )
    }

    if (this.props.type === "scale") {
      return (
        <ScaleItem
          {...this.props}
          onCancel={this.handleItemCancel(this.props.order)}
          toggleExpand={this.toggleExpand}
          onRemoval={this.handleItemRemoval}
        />
      )
    }

    if (this.props.type === "essay") {
      return (
        <EssayItem
          {...this.props}
          onCancel={this.handleItemCancel(this.props.order)}
          toggleExpand={this.toggleExpand}
          onRemoval={this.handleItemRemoval}
        />
      )
    }

    if (this.props.type === "checkbox") {
      return (
        <Checkbox
          {...this.props}
          onCancel={this.handleItemCancel(this.props.order)}
          toggleExpand={this.toggleExpand}
          onRemoval={this.handleItemRemoval}
        />
      )
    }

    if (this.props.type === "research-agreement") {
      return (
        <ResearchAgreement
          {...this.props}
          onCancel={this.handleItemCancel(this.props.order)}
          toggleExpand={this.toggleExpand}
          onRemoval={this.handleItemRemoval}
        />
      )
    }

    return (
      <Card
        style={{
          marginBottom: 20,
          backgroundColor: this.props.expanded ? "#DDDDDD" : "inherit",
        }}
      >
        <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
          <Grid item={true} xs={11}>
            <DragHandleWrapper>
              <CardHeader
                title={
                  this.props.title
                    ? this.props.title + " (" + this.props.type + ")"
                    : this.props.type[0].toUpperCase() +
                      this.props.type.slice(1)
                }
                titleTypographyProps={{
                  variant: "title",
                  gutterBottom: false,
                }}
              />
            </DragHandleWrapper>
          </Grid>

          <Grid item={true} xs={1}>
            <Grid container={true} justify="flex-end">
              <Grid item={true}>
                <CardActions>
                  <IconButton onClick={this.toggleExpand}>
                    <SvgIcon>
                      {this.props.expanded ? (
                        <path d="M9 6l-4.5 4.5 1.06 1.06L9 8.12l3.44 3.44 1.06-1.06z" />
                      ) : (
                        <path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" />
                      )}
                    </SvgIcon>
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Collapse in={this.props.expanded}>
          <CardContent>
            <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
              <Grid item={true} xs={12}>
                <Card>
                  <CardHeader subheader="general" />
                  <CardContent>
                    <Typography variant="subtitle1">
                      Type: {this.props.type}
                    </Typography>

                    <TextField
                      inputProps={{
                        ref: this.titleRef,
                      }}
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

                    {this.props.type === "essay" && (
                      <Grid container={true} spacing={16}>
                        <Grid item={true} xs={12}>
                          <TextField
                            label="min words (optional)"
                            value={this.props.minWords || undefined}
                            onChange={
                              executeIfOnlyDigitsInTextField(
                                this.props.handleChange(
                                  `items[${this.props.index}].minWords`,
                                ),
                              ) as ((
                                event: ChangeEvent<HTMLInputElement>,
                              ) => void)
                            }
                            margin="normal"
                            type="number"
                            inputProps={{ min: "0" }}
                            fullWidth={true}
                          />
                        </Grid>

                        <Grid item={true} xs={12}>
                          <TextField
                            label="max words (optional)"
                            value={this.props.maxWords || undefined}
                            onChange={
                              executeIfOnlyDigitsInTextField(
                                this.props.handleChange(
                                  `items[${this.props.index}].maxWords`,
                                ),
                              ) as ((
                                event: ChangeEvent<HTMLInputElement>,
                              ) => void)
                            }
                            margin="normal"
                            type="number"
                            inputProps={{ min: "0" }}
                            fullWidth={true}
                          />
                        </Grid>
                      </Grid>
                    )}

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

                    {this.props.type === "open" && (
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
                    )}

                    <Grid container={true} style={{ marginTop: 20 }}>
                      <Grid item={true} xs={12}>
                        <Grid container={true} justify="flex-end">
                          <IconButton
                            onClick={this.handleItemRemoval(
                              "items",
                              this.props.index,
                            )}
                            aria-label="Delete"
                            color="secondary"
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {renderOptions(this.props.type) && (
                <Grid item={true} xs={12}>
                  <Card>
                    <CardHeader subheader="Options / Answer alternatives" />
                    <CardContent>
                      <OptionContainer
                        axis="xy"
                        expandedOptions={this.state.expandedOptions}
                        expansionChange={this.expandOption}
                        onSortEnd={this.onOptionSortEnd}
                        index={this.props.index}
                        useDragHandle={true}
                        language={this.props.language}
                        handleChange={this.props.handleChange}
                        remove={this.props.remove}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    )
  }

  private handleItemRemoval = (path, index) => () => {
    this.props.remove(path, index)
  }

  private handleItemCancel = quizItemOrder => () => {
    this.props.remove("items", quizItemOrder)
  }

  private toggleExpand = event => {
    this.props.expandItem(this.props.order)
  }

  private onOptionSortEnd = ({ oldIndex, newIndex, collection }) => {
    const newExpList = { ...this.state.expandedOptions }
    const temp = newExpList[oldIndex]
    newExpList[oldIndex] = newExpList[newIndex]
    newExpList[newIndex] = temp
    this.setState({
      expandedOptions: newExpList,
    })
    this.props.changeOrder(collection, oldIndex, newIndex)
  }
}

export default connect(
  null,
  { changeOrder, remove },
)(Item)
