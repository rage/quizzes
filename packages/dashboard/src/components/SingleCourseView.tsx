import { Button, Card, Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { firstWords, wordCount } from "../../../common/src/util"
import { IQuiz } from "../interfaces"
import { newQuiz } from "../store/edit/actions"
import { setCourse } from "../store/filter/actions"
import LanguageBar from "./GeneralTools/LanguageBar"

class SingleCourseView extends React.Component<any, any> {
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
      this.props.quizzesOfCourse &&
      this.props.quizzesOfCourse.quizzes &&
      this.props.filter.course === this.props.match.params.id
    ) {
      this.initialize()
    }
  }

  public initialize = () => {
    const newParts = {}

    this.props.quizzesOfCourse.quizzes.forEach(q => {
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

  public componentDidMount() {
    if (
      !this.state.initialized &&
      this.props.quizzesOfCourse &&
      this.props.quizzesOfCourse.quizzes &&
      this.props.filter.course === this.props.match.params.id
    ) {
      this.initialize()
    }

    if (
      this.props.match.params.id &&
      (!this.props.filter.course ||
        this.props.filter.course !== this.props.match.params.id)
    ) {
      this.props.setCourseTo(this.props.match.params.id)
    }
  }

  public render() {
    if (!this.props.quizzesOfCourse) {
      return <div />
    }
    const currentCourse = this.props.courses.find(
      course => this.props.match.params.id === course.id,
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
            <Grid item={true} sm={3} />
            <Grid item={true} xs={12} sm={6} style={{ alignSelf: "center" }}>
              <Typography variant="title" style={{ textAlign: "center" }}>
                {currentCourse.texts[0] &&
                  currentCourse.texts[0].title.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item={true} sm={1} />

            <Grid item={true} xs="auto" sm={2}>
              <Grid container={true} justify="flex-end" alignItems="stretch">
                <Grid item={true} xs="auto">
                  <Link to="/new" style={{ textDecoration: "none" }}>
                    <Button
                      variant="text"
                      style={{
                        borderRadius: "0px",
                        backgroundColor: "#107EAB",
                        color: "white",
                      }}
                    >
                      New quiz
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <LanguageBar />

            <Grid item={true} xs="auto">
              <Typography variant="subtitle1">
                QUIZZES ON THIS COURSE
              </Typography>
            </Grid>
            <Grid item={true} xs={12} style={{ backgroundColor: "#F8F8F8" }}>
              <Grid
                container={true}
                spacing={24}
                justify="center"
                alignItems="center"
                style={{ paddingLeft: ".5em", paddingRight: ".5em" }}
              >
                {JSON.stringify(this.state.parts) !== "{}" &&
                  Object.keys(this.state.parts).map(part => {
                    return (
                      <PartComponent
                        answerCounts={this.props.answerCounts}
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

const PartComponent = ({ sections, partNumber, answerCounts }) => {
  return (
    <React.Fragment>
      <Grid item={true} xs="auto">
        <Typography variant="title">Part {partNumber} </Typography>
      </Grid>
      <Grid item={true} xs={12}>
        <Grid
          container={true}
          spacing={16}
          justify="flex-start"
          style={{ backgroundColor: "white" }}
        >
          {Object.keys(sections).map(section => {
            return (
              <SectionComponent
                key={section}
                sectionNumber={section}
                quizzes={sections[section]}
                answerCounts={answerCounts}
              />
            )
          })}
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const SectionComponent = ({ quizzes, sectionNumber, answerCounts }) => {
  return (
    <React.Fragment>
      <Grid item={true} xs="auto" style={{ marginLeft: "1em" }}>
        <Typography variant="subtitle1">SECTION {sectionNumber}</Typography>
      </Grid>

      {quizzes.map((q, idx) => {
        return (
          <Grid item={true} xs={12} key={q.id}>
            <CourseComponent
              idx={idx}
              quiz={q}
              countData={answerCounts.find(a => a.quizId === q.id)}
            />
          </Grid>
        )
      })}
    </React.Fragment>
  )
}

const CourseComponent = ({ idx, countData, quiz }) => {
  return (
    <Card
      square={true}
      raised={true}
      elevation={2}
      style={{
        backgroundColor:
          countData && countData.count > 0
            ? "rgb(199, 66, 37)"
            : "rgb(14, 105, 143)",
      }}
    >
      <Grid
        container={true}
        justify="space-between"
        alignItems="center"
        style={{ padding: ".5em 1em .5em 1em" }}
      >
        <Grid item={true} xs={8} md={10} lg={11} style={{ cursor: "pointer" }}>
          <Link
            to={`/quizzes/${quiz.id}/answers`}
            style={{ textDecoration: "none" }}
          >
            <Typography variant="subtitle1" style={{ color: "white" }}>
              Quiz {idx + 1}: {quiz.texts[0].title}{" "}
            </Typography>
          </Link>
        </Grid>

        <Grid item={true} xs="auto">
          <Link to={`/quizzes/${quiz.id}`} style={{ textDecoration: "none" }}>
            <Button
              variant="text"
              size="small"
              style={{
                borderRadius: "0px",
                backgroundColor: "#107EAB",
                color: "white",
                padding: "-.5em",
              }}
            >
              Edit
            </Button>
          </Link>
        </Grid>

        <Grid item={true} xs={9} style={{ cursor: "pointer" }}>
          <Link
            to={`/quizzes/${quiz.id}/answers`}
            style={{ textDecoration: "none" }}
          >
            <Typography variant="body1" style={{ color: "white" }}>
              {wordCount(quiz.texts[0].body) < 15
                ? quiz.texts[0].body
                : firstWords(quiz.texts[0].body, 15) + " ..."}
            </Typography>
          </Link>
        </Grid>

        {countData && countData.count > 0 && (
          <Grid item={true} xs={3}>
            <Typography
              variant="body1"
              style={{
                textAlign: "right",
              }}
            >
              {countData.count} answer{countData.count === 1 ? "" : "s"}{" "}
              requiring attention
            </Typography>
          </Grid>
        )}

        <Grid item={true} xs={12}>
          <Typography variant="body1" style={{ color: "white" }}>
            {quizItemTypes(quiz)}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

const mapStateToProps = (state: any) => {
  return {
    answerCounts: state.answerCounts,
    courses: state.courses,
    filter: state.filter,
    quizzesOfCourse: state.quizzes.courseInfos.find(
      qi => qi.courseId === state.filter.course,
    ),
  }
}

const mapDispatchToProps = {
  setCourseTo: setCourse,
  newQuiz,
}

const quizItemTypes = (quiz: IQuiz): string => {
  return `[${[...new Set(quiz.items.map(qi => qi.type))].sort().join(", ")}]`
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleCourseView)
