import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core"
import queryString from "query-string"
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { setAllAnswersCount } from "../../store/answerCounts/actions"
import {
  setAllAnswers,
  setAttentionRequiringAnswers,
} from "../../store/answers/actions"
import { setQuiz } from "../../store/filter/actions"
import LanguageBar from "../GeneralTools/LanguageBar"
import Answers from "./Answers"
import DataExporter from "./DataExporter"
import FilterOptions from "./FilterOptions"
import GeneralQuizStatistics from "./GeneralQuizStatistics"

class QuizStatistics extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      initialized: false,
      showingAll: false,
      displayingPage: 1,
      answersPerPage: 10,
      scrollDownAfterUpdate: false,
      waitingForNewAnswers: false,
    }
  }

  public componentDidUpdate() {
    const queryParams = queryString.parse(this.props.location.search)
    const showing = queryParams.all && queryParams.all === "true"

    if (this.state.showingAll !== showing) {
      if (showing) {
        this.props.setAllAnswers(this.props.match.params.id, 1, 10)
        this.props.setAllAnswersCount(this.props.match.params.id)
      } else {
        this.props.setAttentionRequiringAnswers(
          this.props.match.params.id,
          1,
          10,
        )
      }
      this.setState({
        showingAll: showing,
        displayingPage: 1,
        answersPerPage: 10,
      })
    }

    if (
      this.state.scrollDownAfterUpdate &&
      this.state.answersPerPage === this.props.answers.length
    ) {
      this.setState({ scrollDownAfterUpdate: false })
      scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "auto" })
    }
  }

  public async componentDidMount() {
    await this.props.setQuiz(this.props.match.params.id)

    const queryParams = queryString.parse(this.props.location.search)
    const showing = queryParams.all && queryParams.all === "true"

    if (showing) {
      this.props.setAllAnswers(
        this.props.match.params.id,
        this.state.displayingPage,
        this.state.answersPerPage,
      )
      this.props.setAllAnswersCount(this.props.match.params.id)
    } else {
      this.props.setAttentionRequiringAnswers(
        this.props.match.params.id,
        this.state.displayingPage,
        this.state.answersPerPage,
      )
    }
    this.setState({
      showingAll: showing,
      initialized: true,
    })
  }

  public render() {
    if (!this.props.quizzesOfCourse) {
      return <p />
    }
    const quiz = this.props.quizzesOfCourse.quizzes.find(
      c => c.id === this.props.match.params.id,
    )
    const currentCourse = this.props.courses.find(
      c => c.id === this.props.filter.course,
    )

    if (!quiz) {
      return <p />
    }

    const countInfo = this.props.answerCounts.find(
      ci => ci.quizId === this.props.match.params.id,
    )

    let totalNumberOfResults = 0
    if (countInfo) {
      totalNumberOfResults = this.state.showingAll
        ? countInfo.totalCount
        : countInfo.count
    }

    return (
      <Grid container={true} justify="center" alignItems="center" spacing={16}>
        <Grid item={true} xs={12} md={10}>
          <Grid
            container={true}
            direction="row-reverse"
            justify="center"
            alignItems="stretch"
            spacing={16}
          >
            <Grid item={true} xs={12}>
              <Link
                to={`/quizzes/${this.props.filter.quiz}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(16, 126, 171)",
                    color: "white",
                    borderRadius: "0px",
                  }}
                >
                  View the editor
                </Button>
              </Link>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid
                container={true}
                justify="center"
                direction="column"
                alignContent="center"
                alignItems="center"
              >
                <Grid item={true}>
                  <Typography variant="title">
                    {currentCourse &&
                      currentCourse.texts[0] &&
                      currentCourse.texts[0].title.toUpperCase()}
                  </Typography>
                </Grid>

                <Grid item={true}>
                  <Typography variant="subtitle1">
                    Part {quiz.part} section {quiz.section}
                  </Typography>
                </Grid>

                <Grid
                  item={true}
                  xs={12}
                  md={10}
                  lg={8}
                  style={{ minWidth: "50%" }}
                >
                  <Paper
                    square={true}
                    style={{
                      padding: "1.5em",
                    }}
                  >
                    <Grid container={true} justify="center" spacing={24}>
                      <Grid item={true} xs={12}>
                        <Typography
                          variant="h5"
                          style={{ textAlign: "center" }}
                        >
                          {quiz.texts[0].title}
                        </Typography>
                      </Grid>
                      <Grid item={true} xs={12}>
                        <Typography
                          variant="body1"
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {quiz.texts[0].body}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
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
                  <Grid
                    container={true}
                    direction="row"
                    justify="center"
                    spacing={8}
                  >
                    {this.state.showingAll ? (
                      <FilterOptions numberOfAnswers={totalNumberOfResults} />
                    ) : (
                      <GeneralQuizStatistics
                        numberOfAnswers={totalNumberOfResults}
                      />
                    )}

                    <DataExporter quiz={quiz} />
                  </Grid>
                </Grid>

                <Grid item={true} xs={12} md={8}>
                  <Answers
                    inWaitingState={this.state.waitingForNewAnswers}
                    answers={this.props.answers}
                    quiz={quiz}
                    showingAll={this.state.showingAll}
                    currentPage={this.state.displayingPage}
                    totalPages={Math.ceil(
                      totalNumberOfResults / this.state.answersPerPage,
                    )}
                    onPageChange={this.handlePageChange}
                    resultsPerPage={this.state.answersPerPage}
                    changeResultsPerPage={this.handleChangeAnswersPerPage}
                    updateAnswers={this.updateAnswers}
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

  public updateAnswers = async () => {
    ;(await this.state.showingAll)
      ? this.props.setAllAnswers(
          this.props.filter.quiz,
          this.state.displayingPage,
          this.state.answersPerPage,
        )
      : this.props.setAttentionRequiringAnswers(
          this.props.filter.quiz,
          this.state.displayingPage,
          this.state.answersPerPage,
        )
  }

  public handleChangeAnswersPerPage = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    finishAtBottom: boolean = false,
  ) => {
    if (typeof finishAtBottom !== "boolean") {
      finishAtBottom = false
    }

    const newLengthOfPage = Number(e.target.value)
    if (newLengthOfPage === this.state.answersPerPage) {
      return
    }

    const indexOfFirstOnPage =
      this.state.answersPerPage * (this.state.displayingPage - 1) + 1
    const newDisplayingPage = Math.ceil(indexOfFirstOnPage / newLengthOfPage)

    this.setState({
      answersPerPage: newLengthOfPage,
      displayingPage: newDisplayingPage,
      scrollDownAfterUpdate:
        finishAtBottom && newLengthOfPage > this.state.answersPerPage,
    })

    this.state.showingAll
      ? this.props.setAllAnswers(
          this.props.filter.quiz,
          newDisplayingPage,
          newLengthOfPage,
        )
      : this.props.setAttentionRequiringAnswers(
          this.props.filter.quiz,
          newDisplayingPage,
          newLengthOfPage,
        )
  }

  public handlePageChange = (newPage: number) => async () => {
    if (newPage < 1) {
      newPage = 1
    }

    const countInfo = this.props.answerCounts.find(
      ci => ci.quizId === this.props.match.params.id,
    )
    const pages = Math.ceil(
      (this.state.showingAll ? countInfo.totalCount : countInfo.count) /
        this.state.answersPerPage,
    )

    if (newPage > pages) {
      newPage = pages
    }

    this.setState({
      displayingPage: newPage,
      waitingForNewAnswers: true,
    })

    if (this.state.showingAll) {
      await this.props.setAllAnswers(
        this.props.filter.quiz,
        newPage,
        this.state.answersPerPage,
      )
    } else {
      await this.props.setAttentionRequiringAnswers(
        this.props.filter.quiz,
        newPage,
        this.state.answersPerPage,
      )
    }
    this.setState({
      waitingForNewAnswers: false,
    })
  }
}

const mapStateToProps = (state: any) => {
  return {
    answerCounts: state.answerCounts,
    answers: state.answers,
    quizzesOfCourse: state.quizzes.courseInfos.find(
      qi => qi.courseId === state.filter.course,
    ),
    courses: state.courses,
    filter: state.filter,
    user: state.user,
  }
}

export default connect(
  mapStateToProps,
  {
    setAllAnswers,
    setAllAnswersCount,
    setAttentionRequiringAnswers,
    setQuiz,
  },
)(QuizStatistics)
