import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { clear, setCourse } from "../store/filter/actions"

const CourseCard = ({ course }) => {
  return (
    <Card>
      <Link to={`/courses/${course.id}`}>
        <CardHeader title={course.texts[0].title} />
      </Link>
      <CardContent>
        <Typography variant="body1">
          Languages:{" "}
          {course.languages.map(language => language.name).splice(", ")}
        </Typography>
      </CardContent>
    </Card>
  )
}

class CoursesView extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public componentDidMount() {
    if (this.props.filter.course) {
      this.props.clear()
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Typography variant="title" style={{ marginBottom: 10 }}>
          All courses
        </Typography>

        <Grid
          container={true}
          spacing={24}
          alignItems="center"
          justify="center"
        >
          {this.props.courses.map(course => (
            <Grid item={true} xs={12} sm={6} md={6} lg={4} xl={3}>
              <CourseCard key={course.id} course={course} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    filter: state.filter,
    quizzes: state.quizzes,
  }
}

export default connect(
  mapStateToProps,
  { clear, setCourse },
)(CoursesView)
