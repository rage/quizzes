import {
  Button,
  Grid,
  IconButton,
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
import Flag from "@material-ui/icons/Flag"
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

class NewCourseView extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      parts: {},
      initialized: false,
    }
  }

  public componentDidUpdate() {
    if (
      !this.state.initialized &&
      this.props.quizzes &&
      this.props.quizzes.length > 0 &&
      this.props.filter.course
    ) {
      const newParts = {}

      this.props.quizzes
        .filter(q => q.courseId === this.props.filter.course)
        .forEach(q => {
          let sections = newParts[`${q.part}`]
          if (!sections) {
            sections = {}
            newParts[`${q.part}`] = sections
          }
          let section = sections[`${q.section}`]
          if (!section) {
            section = []
          }
          section = section.concat(q)
          sections[`${q.section}`] = section
        })

      this.setState({
        parts: newParts,
        initialized: true,
      })
    }
  }

  public componentDidMount() {
    this.setState({ initialized: false })

    if (
      this.props.match.params.id &&
      (!this.props.filter.course ||
        this.props.filter.course !== this.props.match.params.id)
    ) {
      this.props.setCourseTo(this.props.match.params.id)
    }
  }

  public render() {
    if (this.props.courses.length === 0) {
      return <div />
    }
    const currentCourse = this.props.courses.find(
      course => this.props.filter.course === course.id,
    )
    if (!currentCourse) {
      return <div />
    }

    return (
      <Grid container={true} justify="center" alignItems="center" spacing={16}>
        <Grid item={true} xs={10}>
          <Grid
            container={true}
            justify="center"
            alignItems="stretch"
            spacing={16}
          >
            <Grid item={true} xs="auto">
              <Typography variant="title">
                {currentCourse.texts[0] &&
                  currentCourse.texts[0].title.toUpperCase()}
              </Typography>
            </Grid>

            <LanguageBar />

            <Grid item={true} xs="auto">
              <Typography variant="subtitle1">
                QUIZZES ON THIS COURSE
              </Typography>
            </Grid>
            <Grid item={true} xs={12} style={{ backgroundColor: "#F8F8F8" }}>
              <Grid container={true} justify="flex-start" alignItems="center">
                {JSON.stringify(this.state.parts) !== "{}" &&
                  Object.keys(this.state.parts).map(part => {
                    return (
                      <PartComponent
                        key={part}
                        partNumber={part}
                        sections={this.state.parts[part]}
                      />
                    )
                  })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const LanguageBar = props => {
  return (
    <Grid item={true} xs={12} style={{ backgroundColor: "#F8F8F8" }}>
      <Grid container={true} justify="space-between">
        <Grid item={true} xs="auto">
          <IconButton>
            <Flag />
          </IconButton>
          <IconButton>
            <Flag />
          </IconButton>
          <IconButton>
            <Flag />
          </IconButton>
        </Grid>
        <Grid item={true} xs="auto">
          <Button
            variant="text"
            style={{
              borderRadius: "0px",
              backgroundColor: "#107EAB",
              color: "white",
            }}
          >
            Add language
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

const PartComponent = ({ sections, partNumber }) => {
  return (
    <React.Fragment>
      <Typography>Part {partNumber} </Typography>
      {Object.keys(sections).map(section => {
        return (
          <SectionComponent
            key={section}
            sectionNumber={section}
            quizzes={sections[section]}
          />
        )
      })}
    </React.Fragment>
  )
}

const SectionComponent = ({ quizzes, sectionNumber }) => {
  return (
    <React.Fragment>
      <Typography>Section {sectionNumber}</Typography>
      {quizzes.map(q => {
        return (
          <Grid item={true} xs={12} key={q.id}>
            <Button>{q.texts[0].title}</Button>
          </Grid>
        )
      })}
    </React.Fragment>
  )
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
)(NewCourseView)
