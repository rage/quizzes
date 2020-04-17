import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import DragHandleWrapper from "./DragHandleWrapper"

interface IPeerReviewQuestionState {
  expanded: boolean
}

interface IPeerReviewQuestionProps {
  answerRequired: boolean
  default: boolean
  order: number
  type: "essay" | "grade"
  title?: string
  body?: string
  index: number
  textIndex: number
  collectionIndex: number
  handleChange: (attribute: string) => any
  remove: (e: any, idx: number) => any
}

class PeerReviewQuestion extends React.Component<
  IPeerReviewQuestionProps,
  IPeerReviewQuestionState
> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

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
    if (nextProps.default !== this.props.default) {
      return true
    }
    if (nextProps.answerRequired !== this.props.answerRequired) {
      return true
    }
    return false
  }

  public render() {
    return (
      <Card style={{ marginBottom: 20 }}>
        {!this.state.expanded ? (
          <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
            <Grid item={true} xs={11}>
              <DragHandleWrapper>
                <CardHeader
                  title={`${this.props.title} (${this.props.type})`}
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
                  <CardHeader subheader={this.props.type} />
                  <CardContent>
                    <TextField
                      label="title"
                      value={this.props.title || undefined}
                      fullWidth={true}
                      onChange={this.props.handleChange(
                        `peerReviewCollections[${this.props.collectionIndex}].questions[${this.props.index}].texts[${this.props.textIndex}].title`,
                      )}
                      multiline={true}
                      margin="normal"
                    />
                    {this.props.type === "essay" && (
                      <TextField
                        label="body"
                        value={this.props.body || undefined}
                        fullWidth={true}
                        onChange={this.props.handleChange(
                          `peerReviewCollections[${this.props.collectionIndex}].questions[${this.props.index}].texts[${this.props.textIndex}].body`,
                        )}
                        multiline={true}
                        margin="normal"
                      />
                    )}
                    <Grid container={true} style={{ marginTop: 20 }}>
                      <Grid item={true} xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={this.props.answerRequired}
                              onChange={this.props.handleChange(
                                `peerReviewCollections[${this.props.collectionIndex}].questions[${this.props.index}].answerRequired`,
                              )}
                              color="primary"
                            />
                          }
                          label="answer required"
                        />
                      </Grid>
                      <Grid item={true} xs={12}>
                        <Grid container={true} justify="flex-end">
                          <IconButton
                            onClick={this.props.remove(
                              `peerReviewCollections[${this.props.collectionIndex}].questions`,
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
                  </CardContent>
                </Card>
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

export default connect()(PeerReviewQuestion)
