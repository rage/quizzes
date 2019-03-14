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
  addReviewQuestion,
  changeAttr,
  changeOrder,
  newQuiz,
  save,
  setEdit,
} from "../store/edit/actions"
import DragHandleWrapper from "./DragHandleWrapper"
import OptionContainer from "./OptionContainer"
import PeerReviewQuestionContainer from "./PeerReviewQuestionContainer"

class PeerReviewQuestionCollection extends React.Component<any, any> {
  private reviewTypes = ["essay", "grade"]

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      menuOpen: false,
      menuAnchor: null,
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (nextState.expanded !== this.state.expanded) {
      return true
    }
    if (nextState.menuOpen !== this.state.menuOpen) {
      return true
    }
    if (nextProps.title !== this.props.title) {
      return true
    }
    if (nextProps.body !== this.props.body) {
      return true
    }
    return false
  }

  public render() {
    // console.log("collection")

    const renderOptions = type => {
      return ["multiple-choice", "checkbox", "research-agreement"].includes(
        type,
      )
    }

    return (
      <Card style={{ marginBottom: 20 }}>
        {!this.state.expanded ? (
          <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
            <Grid item={true} xs={11}>
              <DragHandleWrapper>
                <CardHeader
                  title={this.props.title}
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
                        `peerReviewCollections[${this.props.index}].texts[${
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
                        `peerReviewCollections[${this.props.index}].texts[${
                          this.props.textIndex
                        }].body`,
                      )}
                      multiline={true}
                      margin="normal"
                    />
                    <Grid container={true} style={{ marginTop: 20 }}>
                      <Grid item={true} xs={12}>
                        <Grid container={true} justify="flex-end">
                          <IconButton
                            onClick={this.props.remove(
                              "peerReviewCollections",
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
              <Grid item={true} xs={12}>
                <Paper style={{ padding: 30 }}>
                  <Typography variant="subtitle1" style={{ marginBottom: 10 }}>
                    Questions:
                  </Typography>
                  <PeerReviewQuestionContainer
                    collectionIndex={this.props.index}
                    handleChange={this.props.handleChange}
                    onSortEnd={this.props.handleSort}
                    useDragHandle={true}
                    remove={this.props.remove}
                    questions={this.props.questions}
                  />
                  <Button id="review" onClick={this.handleMenu}>
                    Add review question
                  </Button>
                  <Menu
                    anchorEl={this.state.menuAnchor}
                    open={this.state.menuOpen === "review"}
                    onClose={this.handleMenu}
                  >
                    {this.reviewTypes.map((type, index) => (
                      <MenuItem
                        key={type + index}
                        value={type}
                        onClick={this.addReviewQuestion(type)}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Menu>
                </Paper>
              </Grid>
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

  private handleMenu = event => {
    this.setState({
      menuOpen: event.currentTarget.id,
      menuAnchor: event.currentTarget,
    })
  }
  private addReviewQuestion = type => event => {
    console.log("add")
    this.setState({
      menuOpen: null,
    })
    this.props.addReviewQuestion(this.props.index, type)
  }
}

const mapDispatchToProps = {
  addReviewQuestion,
}

export default connect(
  null,
  mapDispatchToProps,
)(PeerReviewQuestionCollection)
