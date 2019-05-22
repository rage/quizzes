import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { setCourse } from "../store/filter/actions"

class SingleCourseView extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public componentDidMount() {
    if (
      this.props.match.params.id &&
      (!this.props.filter.course ||
        this.props.filter.course !== this.props.match.params.id)
    ) {
      this.props.setCourseTo(this.props.match.params.id)
    }
  }

  public render() {
    return (
      <div>
        <div>
          <Toolbar style={{ marginBottom: 20 }}>
            <Select
              value={this.props.filter.course || ""}
              onChange={this.handleSelect}
              style={{ minWidth: 350 }}
            >
              {this.props.courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.texts[0].title}
                </MenuItem>
              ))}
            </Select>
            <Typography style={{ flex: 1 }} />
            {this.props.filter.course === "" ? (
              <p />
            ) : (
              <Link to="/new" style={{ textDecoration: "none" }}>
                <Button>New quiz</Button>
              </Link>
            )}
          </Toolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>Title</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.quizzes
                .filter(quiz => quiz.course.id === this.props.filter.course)
                .map(quiz => (
                  <TableRow key={quiz.id}>
                    <TableCell>
                      <Link to={`/quizzes/${quiz.id}`}>
                        {quiz.texts[0] ? quiz.texts[0].title : "no title"}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  private handleSelect = event => {
    const courseId = event.target.value
    if (this.props.history.location.pathname !== "/courses/" + courseId) {
      this.props.history.push("/courses/" + courseId)
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    filter: state.filter,
    quizzes: state.quizzes,
  }
}

const mapDispatchToProps = {
  setCourseTo: setCourse,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleCourseView)
