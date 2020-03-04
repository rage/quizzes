import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core"
import * as React from "react"
import { connect } from "react-redux"
import { ICourse } from "../interfaces"
import { getCourseQuizIdCorrespondense } from "../services/courses"
import { createAndSaveSpaceSeparatedValueFile } from "./tools"

interface ICorrespondenceFileState {
  showDialog: boolean
  oldCourseId: string
  newCourseId: string
  downloading: boolean
}

interface ICorrespondenceFileProps {
  newCourseId: string
  courses: ICourse[]
  user: any
}

class CorrespondenceIdFileDownloader extends React.Component<
  ICorrespondenceFileProps,
  ICorrespondenceFileState
> {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      oldCourseId: "",
      newCourseId: props.newCourseId,
      downloading: false,
    }
  }

  public render() {
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
          Download correspondence file
        </Button>

        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={this.state.showDialog}
          onClose={this.setDialogOpenness(false)}
          aria-labelledby="duplicate-dialog-title"
        >
          <DialogTitle id="duplicate-dialog-title">
            Generate quiz id correspondence file
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1" style={{ marginBottom: "1rem" }}>
              You can generate a file with the old and new quiz ids. This is
              only meaningful in the case of a duplicated course, where the
              quizzes on old and new courses are similar in content. A great
              help in updating the quiz ids in course material.
            </Typography>

            <FormGroup style={{ marginTop: "10px" }}>
              <InputLabel htmlFor="old-course-selection">
                Old course (was used to create this course)
              </InputLabel>
              <Select
                variant="outlined"
                value={this.state.oldCourseId}
                onChange={this.changeQuizId}
                inputProps={{
                  name: "old course",
                  id: "old-course-selection",
                }}
              >
                {this.props.courses
                  .sort((e1, e2) => {
                    const title1 =
                      e1.texts[0].title && e1.texts[0].title.toLowerCase()
                    const title2 =
                      e2.texts[0].title && e2.texts[0].title.toLowerCase()
                    if (title1 < title2) {
                      return -1
                    } else if (title1 > title2) {
                      return 1
                    }
                    return 0
                  })
                  .map(course => {
                    const { courseId, title, abbreviation } = course.texts[0]

                    return (
                      <MenuItem
                        key={courseId}
                        value={courseId}
                        style={{ height: "inherit" }}
                      >
                        <Typography style={{ whiteSpace: "pre-wrap" }}>
                          {title} ({abbreviation})
                        </Typography>
                      </MenuItem>
                    )
                  })}
              </Select>
            </FormGroup>
          </DialogContent>

          <DialogActions>
            {this.state.downloading ? (
              <Typography>Downloading...</Typography>
            ) : (
              <React.Fragment>
                <Button
                  variant="outlined"
                  onClick={this.setDialogOpenness(false)}
                  color="secondary"
                  style={{
                    backgroundColor: "rgb(200, 34, 34)",
                    color: "white",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="outlined"
                  onClick={this.downloadFile}
                  color="primary"
                  style={{
                    marginLeft: "5px",
                    backgroundColor: "rgb(15, 125, 0)",
                    color: "white",
                  }}
                >
                  Download the file
                </Button>
              </React.Fragment>
            )}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }

  private setDialogOpenness(open: boolean) {
    return () =>
      this.setState({
        showDialog: open,
        oldCourseId: "",
        downloading: false,
      })
  }

  private changeQuizId = (e: any) => {
    this.setState({
      oldCourseId: e.target.value,
    })
  }

  private downloadFile = async () => {
    this.setState({ downloading: true })
    const idInformation = await getCourseQuizIdCorrespondense(
      this.props.newCourseId,
      this.state.oldCourseId,
      this.props.user,
    )
    createAndSaveSpaceSeparatedValueFile(
      idInformation,
      `quiz_ids_${this.state.oldCourseId}_to_${this.props.newCourseId}`,
    )
    this.setDialogOpenness(false)()
  }
}

const mapStateToProps = state => ({
  courses: state.courses,
  newCourseId: state.filter.course,
  user: state.user,
})

export default connect(mapStateToProps)(CorrespondenceIdFileDownloader)
