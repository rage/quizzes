import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
  Typography,
} from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { ICourse } from "../interfaces"
import { createDuplicateCourse } from "../store/courses/actions"
import { createAndSaveSpaceSeparatedValueFile } from "./tools"

interface ICourseDuplicateButtonProps {
  createDuplicateCourse: (
    courseId: string,
    title: string,
    abbreviation: string,
  ) => void
  courseCount: number
  course: ICourse
}

interface ICourseDuplicateButtonState {
  showDialog: boolean
  title: string
  abbreviation: string
  successfullyCreated: boolean
}

class CourseDuplicateButton extends React.Component<
  ICourseDuplicateButtonProps,
  ICourseDuplicateButtonState
> {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      title: "",
      abbreviation: "",
      successfullyCreated: false,
    }
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.courseCount < this.props.courseCount) {
      this.setState({
        successfullyCreated: true,
      })
    }
  }

  public render() {
    const { title, abbreviation } = this.props.course.texts[0]

    if (this.state.successfullyCreated) {
      return <Redirect to="/" />
    }

    return (
      <React.Fragment>
        <Button
          variant="contained"
          style={{
            borderRadius: "0px",
            backgroundColor: "#107EAB",
            color: "white",
          }}
          onClick={this.setDialogOpenness(true)}
        >
          Duplicate course
        </Button>

        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={this.state.showDialog}
          onClose={this.setDialogOpenness(false)}
          aria-labelledby="duplicate-dialog-title"
        >
          <DialogTitle id="duplicate-dialog-title">
            Duplicate course {`${title} (${abbreviation})`}
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1">
              Use this course as a basis for a new course. All the quizzes and
              course settings will be copied into the new course.
            </Typography>

            <Typography variant="body1">
              Please fill in the info for the new course below. After creating
              the new course you will be able to download a file that contains
              the ids of both old and new quiz ids.
            </Typography>
            <FormGroup style={{ marginTop: "10px" }}>
              <TextField
                variant="outlined"
                label="Title"
                value={this.state.title}
                onChange={this.modifyValue("title")}
                style={{
                  margin: "5px 0px",
                }}
              />
              <TextField
                variant="outlined"
                label="Abbreviation"
                value={this.state.abbreviation}
                onChange={this.modifyValue("abbreviation")}
                style={{
                  margin: "5px 0px",
                }}
              />
            </FormGroup>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={this.setDialogOpenness(false)}
              color="secondary"
              style={{ backgroundColor: "rgb(200, 34, 34)", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={this.confirmDuplication}
              color="primary"
              style={{ backgroundColor: "rgb(15, 125, 0)", color: "white" }}
            >
              Duplicate
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }

  private modifyValue = (valueName: "title" | "abbreviation") => (e: any) => {
    const newState = { ...this.state }
    newState[valueName] = e.target.value
    this.setState(newState)
  }

  private setDialogOpenness(open: boolean) {
    return () =>
      this.setState({
        showDialog: open,
        title: "",
        abbreviation: "",
      })
  }

  private confirmDuplication = () => {
    const { title, abbreviation } = this.state
    this.props.createDuplicateCourse(this.props.course.id, title, abbreviation)
  }
}
const mapStateToProps = state => ({
  course: state.courses
    ? state.courses.find(c => c.id === state.filter.course)
    : [],
  courseCount: state.courses ? state.courses.length : 0,
})

export default connect(
  mapStateToProps,
  { createDuplicateCourse },
)(CourseDuplicateButton)
