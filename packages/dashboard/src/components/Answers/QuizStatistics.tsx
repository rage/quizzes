import { CircularProgress, Grid, Typography } from "@material-ui/core"
import queryString from "query-string"
import React from "react"
import { connect } from "react-redux"
import {
  setAllAnswers,
  setAttentionRequiringAnswers,
} from "../../store/answers/actions"
import { setAnswerStatistics } from "../../store/answerStatistics/actions"
import { setCourse, setQuiz } from "../../store/filter/actions"
import LanguageBar from "../GeneralTools/LanguageBar"
import Answers from "./Answers"
import FilterOptions from "./FilterOptions"
import GeneralQuizStatistics from "./GeneralQuizStatistics"

class QuizStatistics extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      showingAll: false,
    }
  }

  public componentDidUpdate() {
    const queryParams = queryString.parse(this.props.location.search)
    const showing = queryParams.all && queryParams.all === "true"

    if (this.state.showingAll !== showing) {
      if (showing) {
        this.props.setAllAnswers(this.props.match.params.id)
      } else {
        this.props.setAttentionRequiringAnswers(this.props.match.params.id)
      }
      this.setState({
        showingAll: showing,
      })
    }
  }

  public componentDidMount() {
    this.props.setAnswerStatistics(this.props.match.params.id)
    const queryParams = queryString.parse(this.props.location.search)
    const showing = queryParams.all && queryParams.all === "true"

    this.props.setQuiz(this.props.match.params.id)

    if (showing) {
      this.props.setAllAnswers(this.props.match.params.id)
    } else {
      this.props.setAttentionRequiringAnswers(this.props.match.params.id)
    }
    this.setState({
      showingAll: showing,
    })
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
            direction="row-reverse"
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

            {this.props.answers &&
            (this.props.answers.length === 0 ||
              this.props.answers[0].quizId === this.props.match.params.id) ? (
              <React.Fragment>
                <Grid
                  item={true}
                  xs={12}
                  md={4}
                  style={{ marginBottom: "1em" }}
                >
                  {this.state.showingAll ? (
                    <FilterOptions
                      numberOfAnswers={this.props.answers.length}
                    />
                  ) : (
                    <GeneralQuizStatistics answers={this.props.answers} />
                  )}
                </Grid>

                <Grid item={true} xs={12} md={8}>
                  <Answers
                    answers={this.props.answers}
                    quiz={quiz}
                    showingAll={this.state.showingAll}
                  />
                </Grid>
              </React.Fragment>
            ) : (
              <Grid item={true} xs={12} style={{ textAlign: "center" }}>
                <CircularProgress size={60} disableShrink={true} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    answers: state.answers,
    quizzes: state.quizzes,
    courses: state.courses,
    filter: state.filter,
  }
}

export default connect(
  mapStateToProps,
  {
    setAllAnswers,
    setAnswerStatistics,
    setAttentionRequiringAnswers,
    setCourse,
    setQuiz,
  },
)(QuizStatistics)
