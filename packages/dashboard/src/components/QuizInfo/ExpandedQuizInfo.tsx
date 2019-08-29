import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core"
import React from "react"
import {
  ICourse,
  ILanguage,
  IQuizText,
  QuizPointsGrantingPolicy,
} from "../../interfaces"
import DeadlineSelector from "./DeadlineSelector"
import { NumberOfPointsSelector, PointsPolicySelector } from "./PointsSelector"
import TriesCustomiser from "./TriesCustomiser"

interface IProps {
  filterLanguage: string
  courseLanguages: ILanguage[]
  quizTexts: IQuizText
  onExpand: () => void
  onCancel: any
  setAttribute: (attribute: string, value: any) => void
  part: number
  section: number
  includesEssay: boolean
  courseId: string
  courses: ICourse[]
  tries: number
  triesLimited: boolean
  grantPointsPolicy: QuizPointsGrantingPolicy
  points?: number
  deadline?: Date
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
  checkboxHasBeenToggledOnce: boolean
  grantPointsPolicy: QuizPointsGrantingPolicy
  points?: number
  deadline: string
  deadlineChecked: boolean
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
    "grantPointsPolicy",
    "points",
    "deadline",
    "deadlineChecked",
  ]

  constructor(props: IProps) {
    super(props)

    let stringDeadline

    if (props.deadline) {
      stringDeadline = formatDateToTextField(props.deadline)
    } else {
      // Only saved if the user checks the deadline checkbox - and then this is the default date
      const deadline = new Date()
      deadline.setMonth(deadline.getMonth() + 3)
      deadline.setHours(0)
      deadline.setMinutes(0)
      stringDeadline = formatDateToTextField(deadline)
    }

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
      checkboxHasBeenToggledOnce: false,
      grantPointsPolicy: props.grantPointsPolicy || "grant_whenever_possible",
      points: props.points || 1,
      deadline: stringDeadline,
      deadlineChecked: !!props.deadline,
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

        <Grid item={true} xs={12}>
          <Grid container={true} justify="space-between" spacing={16}>
            <Grid item={true} xs="auto">
              <FormControl variant="outlined" style={{ marginRight: "5px" }}>
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

              <TextField
                label="Part"
                value={this.state.part}
                onChange={this.changeTempAttribute("part")}
                type="number"
                style={{ maxWidth: "75px", margin: "0 5px" }}
              />

              <TextField
                label="Section"
                value={this.state.section}
                onChange={this.changeTempAttribute("section")}
                type="number"
                style={{ maxWidth: "75px", marginLeft: "5px" }}
              />
            </Grid>

            <Grid item={true} xs="auto">
              <DeadlineSelector
                deadline={this.state.deadline}
                deadlineChecked={this.state.deadlineChecked}
                toggleDeadlineChecked={this.changeTempAttribute(
                  "deadlineChecked",
                )}
                handleDeadlineChange={this.changeTempAttribute("deadline")}
                shouldAnimateTextField={this.state.checkboxHasBeenToggledOnce}
              />
            </Grid>
          </Grid>
        </Grid>

        <div
          style={{
            border: "1px solid black",
            borderRadius: "5px",
            backgroundColor: "#00000010",
            margin: "1rem 0",
            padding: "1rem",
            width: "100%",
          }}
        >
          <Typography
            variant="subtitle1"
            style={{ fontSize: "1.25rem", marginBottom: "5px" }}
          >
            Points and tries
          </Typography>

          <Grid item={true} xs={12} md="auto">
            <div style={{ marginRight: "1rem", display: "inline" }}>
              <NumberOfPointsSelector
                points={this.state.points}
                handlePointsChange={this.changeTempAttribute("points")}
              />
            </div>
            <PointsPolicySelector
              grantPointsPolicy={this.state.grantPointsPolicy}
              handlePolicyChange={this.changeTempAttribute("grantPointsPolicy")}
            />
          </Grid>

          <Grid item={true} xs={12} md="auto" style={{ marginTop: "1rem" }}>
            <TriesCustomiser
              tries={this.state.tries}
              triesLimited={this.state.triesLimited}
              toggleTriesLimited={this.changeTempAttribute("triesLimited")}
              handleTriesChange={this.changeTempAttribute("tries")}
              shouldAnimateTextField={this.state.checkboxHasBeenToggledOnce}
            />
          </Grid>
        </div>

        <Grid item={true} xs={12} style={{ marginBottom: "1.5rem" }}>
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

        <Grid item={true} xs="auto">
          <Button
            variant="outlined"
            style={{
              backgroundColor: "rgb(220, 25, 0)",
              color: "white",
              marginRight: "5px",
            }}
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            style={{ backgroundColor: "rgb(15, 125, 0)", color: "white" }}
            onClick={this.saveChanges}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    )
  }

  private changeTempAttribute = (attributeName: string) => e => {
    const newState = { ...this.state }
    if (attributeName === "triesLimited") {
      newState.triesLimited = !this.state.triesLimited
      newState.checkboxHasBeenToggledOnce = true
    } else if (attributeName === "deadlineChecked") {
      newState.deadlineChecked = !this.state.deadlineChecked
      newState.checkboxHasBeenToggledOnce = true
    } else if (attributeName === "points") {
      const value = e.target.value
      newState[attributeName] = value >= 0 ? value : 0
    } else if (attributeName === "tries") {
      const value = e.target.value
      newState[attributeName] = value >= 1 ? value : 1
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
    this.props.setAttribute("grantPointsPolicy", this.state.grantPointsPolicy)
    this.props.setAttribute(
      "deadline",
      this.state.deadlineChecked
        ? this.state.deadline && new Date(this.state.deadline)
        : null,
    )
    this.props.setAttribute("points", this.state.points)

    this.props.setAttribute("part", this.state.part)
    this.props.setAttribute("section", this.state.section)
    this.props.setAttribute("courseId", this.state.courseId)
    this.props.onExpand()
  }
}

const formatDateToTextField = (date: Date): string => {
  const otherDate = new Date(date)
  otherDate.setMinutes(otherDate.getMinutes() - otherDate.getTimezoneOffset())
  let stringDate = otherDate.toISOString()
  stringDate = stringDate.substring(0, stringDate.length - 8)
  return stringDate
}

export default ExpandedQuizInfo
