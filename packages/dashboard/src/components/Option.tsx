import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { SortableElement } from "react-sortable-hoc"
import DragHandleWrapper from "./DragHandleWrapper"

class Option extends React.Component<any, any> {
  private static attributes: string[] = [
    "index",
    "correct",
    "title",
    "body",
    "successMessage",
    "failureMessage",
  ]

  constructor(props) {
    super(props)
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return Option.attributes.some(
      attribute => nextProps[attribute] === this.props[attribute],
    )
  }

  public render() {
    return (
      <SortableGridItem
        index={this.props.index}
        collection={this.props.collection}
        size={12}
      >
        <Card>
          <Grid style={{ flexGrow: 1 }} container={true} spacing={3}>
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

          {this.props.expanded && (
            <CardContent>
              <Card>
                <CardHeader subheader="general" />
                <CardContent>
                  <TextField
                    label="title"
                    value={this.props.title || undefined}
                    fullWidth={true}
                    onChange={this.props.handleChange(
                      `items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].title`,
                    )}
                    multiline={true}
                    margin="normal"
                  />
                  <TextField
                    label="body"
                    value={this.props.body || undefined}
                    fullWidth={true}
                    onChange={this.props.handleChange(
                      `items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].body`,
                    )}
                    multiline={true}
                    margin="normal"
                  />
                  <TextField
                    label="success message"
                    value={this.props.successMessage || undefined}
                    fullWidth={true}
                    onChange={this.props.handleChange(
                      `items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].successMessage`,
                    )}
                    multiline={true}
                    margin="normal"
                  />
                  <TextField
                    label="failure message"
                    value={this.props.failureMessage || undefined}
                    fullWidth={true}
                    onChange={this.props.handleChange(
                      `items[${this.props.itemIndex}].options[${this.props.index}].texts[${this.props.textIndex}].failureMessage`,
                    )}
                    multiline={true}
                    margin="normal"
                  />
                  <Grid container={true} style={{ marginTop: 20 }}>
                    <Grid item={true} xs={12}>
                      <Grid container={true} justify="space-between">
                        <Grid item={true} xs={1}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.props.correct}
                                onChange={this.props.handleChange(
                                  `items[${this.props.itemIndex}].options[${this.props.index}].correct`,
                                )}
                                color="primary"
                              />
                            }
                            label="correct"
                          />
                        </Grid>
                        <Grid item={true} xs={1}>
                          <Grid container={true} justify="flex-end">
                            <IconButton
                              aria-label="Delete"
                              color="secondary"
                              onClick={this.props.remove(
                                `items[${this.props.itemIndex}].options`,
                                this.props.index,
                              )}
                            >
                              <SvgIcon>
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                              </SvgIcon>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </CardContent>
          )}
        </Card>
      </SortableGridItem>
    )
  }

  private toggleExpand = event => {
    this.props.expansionChange(this.props.index)
  }
}

const SortableGridItem = SortableElement((props: any) => (
  <Grid item={true} xs={props.size}>
    {props.children}
  </Grid>
))

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    edit: state.edit,
    filter: state.filter,
    quizzes: state.quizzes.courseInfos.find(
      qi => qi.courseId === state.filter.course,
    ).quizzes,
    user: state.user,
  }
}

export default connect(mapStateToProps)(Option)
