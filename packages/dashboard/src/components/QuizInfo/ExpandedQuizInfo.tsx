import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  autoConfirm?: boolean
}

interface IState {
  correctedInitial: boolean
  checkboxHasBeenToggledOnce: boolean
  points?: number
  deadlineChecked: boolean
  defaultDeadline: Date
}

class ExpandedQuizInfo extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const deadline = new Date()
    deadline.setMonth(deadline.getMonth() + 3)
    deadline.setHours(0)
    deadline.setMinutes(0)

    this.state = {
      defaultDeadline: deadline,
      correctedInitial: false,
      checkboxHasBeenToggledOnce: false,
      deadlineChecked: !!props.deadline,
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
            value={this.props.quizTexts.title}
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
              {this.props.courseLanguages.map((languageInfo) => {
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
          <Grid container={true} justify="space-between" spacing={3}>
            <Grid item={true} xs="auto">
              <FormControl variant="outlined" style={{ marginRight: "5px" }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={this.props.courseId}
                  onChange={this.changeTempAttribute("courseId")}
                >
                  {this.props.courses.map((course) => {
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
                value={this.props.part}
                onChange={this.changeTempAttribute("part")}
                type="number"
                style={{ maxWidth: "75px", margin: "0 5px" }}
              />

              <TextField
                label="Section"
                value={this.props.section}
                onChange={this.changeTempAttribute("section")}
                type="number"
                style={{ maxWidth: "75px", marginLeft: "5px" }}
              />
            </Grid>

            <Grid item={true} xs="auto">
              <DeadlineSelector
                deadline={this.props.deadline || this.state.defaultDeadline}
                deadlineChecked={this.state.deadlineChecked}
                toggleDeadlineChecked={this.toggleDeadline(
                  this.props.deadline || this.state.defaultDeadline,
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
                points={this.props.points}
                handlePointsChange={this.changeTempAttribute("points")}
              />
            </div>
            <PointsPolicySelector
              grantPointsPolicy={this.props.grantPointsPolicy}
              handlePolicyChange={this.changeTempAttribute("grantPointsPolicy")}
            />
          </Grid>

          <Grid item={true} xs={12} md="auto">
            <FormControlLabel
              control={
                <Checkbox
                  checked={!this.props.autoConfirm}
                  color="primary"
                  onChange={this.changeTempAttribute("autoConfirm")}
                />
              }
              label="Every answer must be manually confirmed"
            />
          </Grid>

          <Grid item={true} xs={12} md="auto">
            <TriesCustomiser
              tries={this.props.tries}
              triesLimited={this.props.triesLimited}
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
            value={this.props.quizTexts.body}
            onChange={this.changeTempAttribute("body")}
          />
        </Grid>

        {this.props.includesEssay && (
          <Grid item={true} xs={12} style={{ marginBottom: "2em" }}>
            <TextField
              label="Submit message"
              value={this.props.quizTexts.submitMessage}
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
              backgroundColor: "rgb(87, 61, 77)",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={this.props.onExpand}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    )
  }

  private toggleDeadline = (deadline?: Date) => () => {
    const changedTo = !this.state.deadlineChecked
    this.setState({
      ...this.state,
      deadlineChecked: changedTo,
      checkboxHasBeenToggledOnce: true,
    })

    if (!changedTo) {
      this.props.setAttribute("deadline", null)
    } else {
      this.props.setAttribute("deadline", deadline)
    }
  }

  private changeTempAttribute = (attributeName: string) => (e) => {
    const value = e.target.value

    switch (attributeName) {
      case "triesLimited":
        this.setState({ ...this.state, checkboxHasBeenToggledOnce: true })
      case "autoConfirm":
      case "triesLimited":
        this.props.setAttribute(attributeName, !this.props[attributeName])
        break
      case "tries":
      case "section":
      case "part":
      case "points":
        this.props.setAttribute(attributeName, Number(value))
        break
      case "deadline":
      default:
        this.props.setAttribute(attributeName, value)
    }
  }
}

export default ExpandedQuizInfo
