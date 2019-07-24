import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core"
import React from "react"
import { ICourse, ILanguage, IQuizText } from "../../interfaces"

const SHOW_COURSE_INFO = true

interface IProps {
  filterLanguage: string
  courseLanguages: ILanguage[]
  quizTexts: IQuizText
  onExpand: () => void
  onCancel: any
  setAttribute: (attribute: string, value: string | number | boolean) => void
  part: number
  section: number
  includesEssay: boolean
  courseId: string
  courses: ICourse[]
  tries: number
  triesLimited: boolean
}

interface IState {
  title: string
  body: string
  submitMessage: string
  part: number
  section: number
  courseId: string
  correctedInitial: boolean
  tries: number
  triesLimited: boolean
  tryCheckBoxHasBeenUsed: boolean
}

class ExpandedQuizInfo extends React.Component<IProps, IState> {
  private attributes = [
    "title",
    "body",
    "submitMessage",
    "part",
    "section",
    "courseId",
    "tries",
    "triesLimited",
  ]

  constructor(props: IProps) {
    super(props)

    this.state = {
      title: (props.quizTexts && props.quizTexts.title) || "",
      body: (props.quizTexts && props.quizTexts.body) || "",
      submitMessage: (props.quizTexts && props.quizTexts.submitMessage) || "",
      part: props.part || 0,
      section: props.section || 0,
      courseId: props.courseId,
      tries: props.tries,
      triesLimited: props.triesLimited,
      correctedInitial: false,
      tryCheckBoxHasBeenUsed: false,
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
            <Select value={this.props.filterLanguage}>
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

        <Grid item={true} xs={12} sm={6} lg={4} style={{ marginTop: "1rem" }}>
          <TriesInformation
            tries={this.state.tries}
            triesLimited={this.state.triesLimited}
            toggleTriesLimited={this.changeTempAttribute("triesLimited")}
            handleTriesChange={this.changeTempAttribute("tries")}
            shouldAnimateTextField={this.state.tryCheckBoxHasBeenUsed}
          />
        </Grid>

        <Grid
          item={true}
          xs={12}
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
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
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const newState = { ...this.state }
    if (attributeName === "triesLimited") {
      newState.triesLimited = !this.state.triesLimited
      newState.tryCheckBoxHasBeenUsed = true
    } else {
      newState[attributeName] = e.target.value
    }
    this.setState({
      ...newState,
    })
  }

  private saveChanges = () => {
    this.props.setAttribute("title", this.state.title)
    this.props.setAttribute("body", this.state.body)
    this.props.setAttribute("submitMessage", this.state.submitMessage)
    this.props.setAttribute("tries", this.state.tries)
    this.props.setAttribute("triesLimited", this.state.triesLimited)

    if (SHOW_COURSE_INFO) {
      this.props.setAttribute("part", this.state.part)
      this.props.setAttribute("section", this.state.section)
      this.props.setAttribute("courseId", this.state.courseId)
    }
    this.props.onExpand()
  }
}

interface ITriesInfoProps {
  triesLimited: boolean
  tries: number
  toggleTriesLimited: (e: any) => void
  handleTriesChange: (e: any) => void
  shouldAnimateTextField: boolean
}

const TriesInformation: React.FunctionComponent<ITriesInfoProps> = ({
  triesLimited,
  toggleTriesLimited,
  tries,
  handleTriesChange,
  shouldAnimateTextField,
}) => {
  return (
    <Grid container={true}>
      <Grid item={true} xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={triesLimited}
              color="primary"
              onChange={toggleTriesLimited}
            />
          }
          label="Number of tries is limited"
        />
      </Grid>

      <Grow
        style={{ transformOrigin: "left center" }}
        in={triesLimited}
        timeout={triesLimited && shouldAnimateTextField ? 500 : 0}
      >
        <Grid item={true} xs={6}>
          <TextField
            label="Tries"
            value={tries}
            onChange={handleTriesChange}
            type="number"
          />
        </Grid>
      </Grow>
    </Grid>
  )
}

export default ExpandedQuizInfo
