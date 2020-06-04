import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { clear } from "../store/filter/actions"

const CourseCard = ({ course }) => {
  return (
    <Card style={{ maxWidth: "30em" }}>
      <Link to={`/courses/${course.id}`}>
        <CardHeader title={course.texts[0] ? course.texts[0].title : ""} />
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
        <Grid container={true} justify="center">
          <Grid item={true} xs={12} md={10} lg={8}>
            <Paper elevation={4} style={{ marginBottom: "2em" }}>
              <Typography
                color="primary"
                variant="h5"
                style={{
                  padding: "1em 0 1em 0",
                  textAlign: "center",
                  flexFlow: "row",
                  backgroundColor: "#EEEEEE",
                }}
              >
                All courses
              </Typography>
            </Paper>
          </Grid>
          <Grid item={true} xs={12} lg={10}>
            <Grid
              container={true}
              spacing={8}
              alignItems="center"
              justify="flex-start"
            >
              {this.props.courses.map(course => (
                <Grid
                  key={course.id}
                  item={true}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                >
                  <CourseCard key={course.id} course={course} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    filter: state.filter,
  }
}

export default connect(mapStateToProps, { clear })(CoursesView)
