import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core"
import React from "react"

const SHOW_COURSE_INFO = true

class ExpandedQuizInfo extends React.Component<any, any> {
  private attributes = [
    "title",
    "body",
    "submitMessage",
    "part",
    "section",
    "courseId",
  ]

  constructor(props) {
    super(props)

    this.state = {
      title: (props.quizTexts && props.quizTexts.title) || "",
      body: (props.quizTexts && props.quizTexts.body) || "",
      submitMessage: (props.quizTexts && props.quizTexts.submitMessage) || "",
      part: props.part || 0,
      section: props.section || 0,
      courseId: props.courseId,
      correctedInitial: false,
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (this.attributes.some(attr => this.state[attr] !== nextState[attr])) {
      return true
    }

    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      return true
    }

    return false
  }

  public componentDidUpdate() {
    if (!this.state.correctedInitial) {
      this.setState({
        title: this.props.quizTexts.title,
        body: this.props.quizTexts.body,
        correctedInitial: true,
      })
    }
  }

  public render() {
    return (
      <Grid container={true} justify="space-between" alignContent="center">
        <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
          <TextField
            placeholder="Title"
            multiline={true}
            rowsMax={10}
            value={this.state.title}
            onChange={this.changeTempAttribute("title")}
            style={{
              fontWeight: "bold",
            }}
          />
        </Grid>
        <Grid item={true} xs={6} />
        <Grid item={true} xs={3} style={{ marginBottom: "2em" }}>
          <FormControl variant="outlined">
            <InputLabel>Language</InputLabel>
            <Select
              value={this.props.filterLanguage}
              // onChange={}
            >
              {this.props.courseLanguages.map(languageInfo => {
                return (
                  <MenuItem value={languageInfo.id} key={languageInfo.id}>
                    {languageInfo.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>

        {SHOW_COURSE_INFO && (
          <Grid item={true} xs={12}>
            <Grid container={true} justify="flex-start" spacing={16}>
              <Grid item={true} xs="auto">
                <FormControl variant="outlined">
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={this.state.courseId}
                    onChange={this.changeTempAttribute("courseId")}
                  >
                    {this.props.courses.map(course => {
                      return (
                        <MenuItem value={course.id} key={course.id}>
                          {course.texts[0].title}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item={true} xs={4} sm={3}>
                <TextField
                  label="Part"
                  value={this.state.part}
                  onChange={this.changeTempAttribute("part")}
                  type="number"
                />
              </Grid>
              <Grid item={true} xs={4} sm={3}>
                <TextField
                  label="Section"
                  value={this.state.section}
                  onChange={this.changeTempAttribute("section")}
                  type="number"
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid
          item={true}
          xs={12}
          style={{ marginBottom: "2em", marginTop: "2em" }}
        >
          <TextField
            label="Body"
            multiline={true}
            rows={4}
            rowsMax={15}
            fullWidth={true}
            variant="outlined"
            value={this.state.body}
            onChange={this.changeTempAttribute("body")}
          />
        </Grid>

        {this.props.includesEssay && (
          <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
            <TextField
              label="Submit message"
              value={this.state.submitMessage}
              onChange={this.changeTempAttribute("submitMessage")}
              multiline={true}
              fullWidth={true}
              rowsMax={10}
              variant="outlined"
            />
          </Grid>
        )}

        <Grid item={true} xs={6} sm={4} md={3}>
          <Button
            variant="outlined"
            style={{ color: "#79c49b" }}
            onClick={this.saveChanges}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            style={{ color: "#d16d68" }}
            onClick={this.props.onExpand}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const newState = { ...this.state }
    newState[attributeName] = e.target.value
    this.setState({
      ...newState,
    })
  }

  private saveChanges = () => {
    this.props.setAttribute("title", this.state.title)
    this.props.setAttribute("body", this.state.body)
    this.props.setAttribute("submitMessage", this.state.submitMessage)
    if (SHOW_COURSE_INFO) {
      this.props.setAttribute("part", this.state.part)
      this.props.setAttribute("section", this.state.section)
      this.props.setAttribute("courseId", this.state.courseId)
    }
    this.props.onExpand()
  }
}

export default ExpandedQuizInfo
const mapStateToProps = state => {
  return {
    courseId: state.edit.courseId,
  }
}
