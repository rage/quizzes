import { Button, Card, Grid, Typography } from "@material-ui/core"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { setCourse } from "../store/filter/actions"
import LanguageBar from "./GeneralTools/LanguageBar"

class QuizStatistics extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
    }
  }

  public componentDidMount() {
    const quiz = this.props.quizzes.find(
      c => c.id === this.props.match.params.id,
    )
    const currentCourse = quiz
      ? this.props.courses.find(c => c.i === quiz.courseId)
      : undefined

    if (
      currentCourse &&
      this.props.match.params.id &&
      (!this.props.filter.course ||
        this.props.filter.course !== currentCourse.id)
    ) {
      this.props.setCourse(currentCourse.id)
    }
  }

  public render() {
    const quiz = this.props.quizzes.find(
      c => c.id === this.props.match.params.id,
    )
    const currentCourse = this.props.courses.find(
      c => c.id === this.props.filter.course,
    )

    if (!quiz) {
      return <p />
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
                {currentCourse &&
                  currentCourse.texts[0] &&
                  currentCourse.texts[0].title.toUpperCase()}
              </Typography>
              <Typography variant="subtitle1">
                Part {quiz.part} section {quiz.section}
              </Typography>
              <Typography variant="subtitle1">{quiz.texts[0].title}</Typography>
            </Grid>

            <LanguageBar />

            <Grid item={true} xs={8}>
              <AttentionAnswers />
            </Grid>

            <Grid item={true} xs={4}>
              <GeneralStatistics />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const AttentionAnswers = props => {
  const placeHolder = [
    [
      {
        title: "Name",
        type: "Test quiz type",
        answer: "I am very unsure",
      },
      {
        title: "Select the correct",
        type: "multiple-choice",
        selected: "wrong",
        correctOption: "right",
      },
    ],
  ]

  return (
    <Grid container={true} justify="flex-start" spacing={24}>
      <Grid
        item={true}
        xs={10}
        style={{ marginBottom: "1em", textAlign: "center" }}
      >
        <Typography variant="title">ANSWERS REQUIRING ATTENTION</Typography>
      </Grid>
      <Grid item={true} xs={2}>
        <Link to="/">
          <Typography color="textPrimary">VIEW ALL</Typography>
        </Link>
      </Grid>

      {placeHolder.map(answer => {
        return <AnswerComponent key={answer[0].title} answerData={answer} />
      })}
    </Grid>
  )
}

class AnswerComponent extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  public render() {
    return (
      <Grid
        item={true}
        xs={12}
        style={{ marginRight: "1em" }}
        onMouseEnter={this.showMore}
        onMouseLeave={this.showLess}
      >
        <Card
          raised={true}
          square={true}
          style={{ borderLeft: "1em solid #FB6949" }}
        >
          <Grid container={true}>
            <Grid item={true} xs={12}>
              {this.props.answerData.map((quizItemAnswer, idx) => {
                return (
                  <ItemAnswerComponent
                    key={idx}
                    idx={idx}
                    isFirst={idx === 0}
                    isLast={idx === this.props.answerData.length - 1}
                  />
                )
              })}
            </Grid>

            {this.state.expanded && (
              <Grid item={true} xs={12}>
                <Typography variant="title">
                  We shall show nice statistics in this place
                </Typography>
              </Grid>
            )}

            <Grid item={true} xs={12} style={{ backgroundColor: "#E5E5E5" }}>
              <Grid
                container={true}
                spacing={8}
                justify="space-between"
                style={{ margin: ".5em .25em .25em .25em" }}
              >
                <Grid item={true} xs={4} md={3}>
                  <Grid container={true} spacing={16}>
                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#029422",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Accept
                      </Button>
                    </Grid>

                    <Grid item={true} xs={6}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#D80027",
                          borderRadius: "0",
                          color: "white",
                        }}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item={true} xs={2} style={{ textAlign: "center" }}>
                  <Typography>Avg: 3,14</Typography>

                  <Typography>SD: 1,00</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  private showMore = () => {
    this.setState({
      expanded: true,
    })
  }

  private showLess = () => {
    this.setState({
      expanded: false,
    })
  }
}

const ItemAnswerComponent = ({ idx, isFirst, isLast }) => {
  return (
    <Grid
      container={true}
      alignItems="center"
      style={{
        borderBottom: isLast ? "none" : "2px dashed #9D9696",
        marginLeft: ".5em",
      }}
    >
      <Grid item={true} xs="auto">
        <Typography variant="subtitle1">
          Question {idx}: "Question title"
        </Typography>
      </Grid>

      <Grid item={true} xs="auto">
        <Typography variant="body1" style={{ color: "#9D9696" }}>
          Type: "Question type"
        </Typography>
      </Grid>

      {isFirst && (
        <React.Fragment>
          <Grid item={true} xs={4} />
          <Grid item={true} xs="auto">
            <Typography variant="body1">0 / 2</Typography>
          </Grid>
        </React.Fragment>
      )}

      <Grid item={true} xs={12} md={10}>
        <Typography variant="body1">
          Pitkä pitkä vastaus tämän olen vastannut opiskelijana hyvästi
        </Typography>
      </Grid>
    </Grid>
  )
}

const GeneralStatistics = props => {
  return (
    <React.Fragment>
      <Grid
        item={true}
        xs={12}
        style={{ marginBottom: "1.5em", textAlign: "center" }}
      >
        <Typography variant="title">QUIZ STATISTICS</Typography>
      </Grid>

      <Grid
        container={true}
        spacing={32}
        style={{ backgroundColor: "#49C7FB" }}
      >
        <Grid item={true} xs={12}>
          <Typography variant="body1">Submissions: xx</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          Waiting for peer review: xx
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {
    quizzes: state.quizzes,
    courses: state.courses,
    filter: state.filter,
  }
}

export default connect(
  mapStateToProps,
  { setCourse },
)(QuizStatistics)
