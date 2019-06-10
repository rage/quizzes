import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import Paper from "@material-ui/core/Paper"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import Breadcrumbs from "@material-ui/lab/Breadcrumbs"
import queryString from "query-string"
import * as React from "react"
import { connect } from "react-redux"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"
import TMCApi from "../../common/src/services/TMCApi"
import { ITMCProfile, ITMCProfileDetails } from "../../common/src/types"
import PeerReviewsView from "./components/Answers/PeerReviewsModal"
import QuizStatistics from "./components/Answers/QuizStatistics"
import CoursesView from "./components/CoursesView"
import QuizForm from "./components/QuizForm"
import SingleCourseView from "./components/SingleCourseView"
import SuccessNotification from "./components/SuccessNotification"
import { setAnswerCounts } from "./store/answerCounts/actions"
import { setCourses } from "./store/courses/actions"
import { newQuiz, setEdit } from "./store/edit/actions"
import { setCourse } from "./store/filter/actions"
import { displayMessage } from "./store/notification/actions"
import { addUser, removeUser } from "./store/user/actions"

class App extends React.Component<any, any> {
  public async componentDidMount() {
    const user = TMCApi.checkStore()
    if (user) {
      const profile = await TMCApi.getProfile(user.accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
        this.props.setCourses()
        this.props.setAnswerCounts()
      }
    }
  }

  public currentCourse = () => {
    if (!this.props.filter.course) {
      return null
    }
    return this.props.courses.find(c => c.id === this.props.filter.course)
  }

  public currentQuizTitle: () => string | null = () => {
    if (!this.props.filter.quiz || !this.props.quizzesOfCourse) {
      return null
    }

    const quiz = this.props.quizzesOfCourse.quizzes.find(
      q => q.id === this.props.filter.quiz,
    )
    return quiz ? quiz.texts[0].title : null
  }

  public render() {
    const Login = () => {
      return (
        <Grid container={true} justify="center">
          <Paper
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "50px 150px 100px",
              marginTop: 100,
            }}
          >
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" fullWidth={true}>
                <InputLabel>Email or username</InputLabel>
                <Input name="username" />
              </FormControl>
              <FormControl margin="normal" fullWidth={true}>
                <InputLabel>Password</InputLabel>
                <Input name="password" type="password" />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: 30 }}
                fullWidth={true}
              >
                Sign in
              </Button>
            </form>
          </Paper>
        </Grid>
      )
    }

    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Router>
          <React.Fragment>
            <SuccessNotification />
            {this.props.user ? (
              <div>
                <div>
                  <AppBar>
                    <Toolbar>
                      <Grid
                        container={true}
                        justify="space-between"
                        alignItems="center"
                        spacing={8}
                      >
                        <Grid item={true} xs={11}>
                          <Grid
                            container={true}
                            justify="flex-start"
                            spacing={0}
                          >
                            <Route
                              exact={false}
                              path="/"
                              component={this.PathBreadcrumbs}
                            />
                          </Grid>
                        </Grid>
                        <Grid item={true} xs={1}>
                          <Button color="inherit" onClick={this.logout}>
                            logout
                          </Button>
                        </Grid>
                      </Grid>
                    </Toolbar>
                  </AppBar>

                  <div style={{ height: 80 }} />
                </div>
                <Route exact={true} path="/" component={CoursesView} />
                <Route exact={true} path="/quizzes/:id" component={this.edit} />
                <Route exact={true} path="/new" component={this.create} />
                <Route exact={true} path="/courses" component={CoursesView} />
                <Route
                  exact={true}
                  path="/courses/:id"
                  component={SingleCourseView}
                />
                <Route
                  exact={true}
                  path="/quizzes/:id/answers"
                  component={QuizStatistics}
                />
              </div>
            ) : (
              <div>
                <Route
                  exact={true}
                  path="/"
                  CourseStatisticscomponent={Login}
                />
                <Route exact={true} path="/quizzes/:id" component={Login} />
                <Route exact={true} path="/new" component={Login} />
                <Route exact={true} path="/courses" component={Login} />
                <Route exact={true} path="/courses/:id" component={Login} />
                <Route
                  exact={true}
                  path="/quizzes/:id/answers"
                  component={Login}
                />
              </div>
            )}
          </React.Fragment>
        </Router>
      </div>
    )
  }

  private PathBreadcrumbs = props => {
    const history = props.history

    const Crumbify = (path: string | null, label: string | null) => () =>
      path ? (
        <Link
          to={path}
          style={{
            textDecoration: "none",
          }}
        >
          <Typography
            align="center"
            style={{ color: "#FFFFFF" }}
            variant="subtitle1"
          >
            {label}
          </Typography>
        </Link>
      ) : (
        <Typography
          align="center"
          style={{ color: "#FFFFFF" }}
          variant="subtitle1"
        >
          {label}
        </Typography>
      )

    const cCourse = this.currentCourse()
    const onQuizPage =
      history.location.pathname.includes("/quizzes/") ||
      history.location.pathname.includes("new")
    const onSavedQuizPage = history.location.pathname.includes("/quizzes/")
    const onAnswerPage = history.location.pathname.includes("/answers/")

    const onRootPage =
      history.location.pathname === "/" ||
      history.location.pathname === "/courses"

    return (
      <Breadcrumbs separator={<NavigateNextIcon />} arial-label="Breadcrumb">
        {Crumbify("/", "Home")()}

        {!onRootPage &&
          cCourse &&
          cCourse.texts[0] &&
          Crumbify(
            onQuizPage ? `/courses/${this.props.filter.course}` : null,
            `${cCourse.texts[0].title}`,
          )()}

        {onSavedQuizPage && Crumbify(null, this.currentQuizTitle())()}

        {// not a fourth, but an alternative to the third
        onAnswerPage &&
          Crumbify(
            `/quizzes/${this.props.filter.quiz}/answers`,
            this.currentQuizTitle(),
          )()}
      </Breadcrumbs>
    )
  }

  private edit = ({ match }) => {
    if (!this.props.quizzesOfCourse) {
      return <p />
    }
    const quiz = this.props.quizzesOfCourse.quizzes.find(
      q => q.id === match.params.id,
    )
    return <QuizForm quiz={quiz} new={false} />
  }

  private create = () => {
    if (this.props.courses.length === 0) {
      return <p />
    }
    return <QuizForm />
  }

  private handleSubmit = async (event: any) => {
    try {
      event.preventDefault()
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ""
      event.target.password.value = ""
      const user: ITMCProfile = await TMCApi.authenticate({
        username,
        password,
      })
      const accessToken = user.accessToken
      const profile = await TMCApi.getProfile(accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
        this.props.setCourses()
      }
      this.props.displayMessage(`Welcome ${user.username}!`, false)
    } catch (exception) {
      console.log(exception)
      this.props.displayMessage("Login failed", true)
    }
  }

  private logout = () => {
    TMCApi.unauthenticate()
    this.props.removeUser()
  }
}

interface IDispatchProps {
  addUser: typeof addUser
  displayMessage: typeof displayMessage
  newQuiz: typeof newQuiz
  setCourse: typeof setCourse
  setCourses: typeof setCourses
  setEdit: typeof setEdit
  removeUser: typeof removeUser
}

interface IStateProps {
  courses: any
  edit: any
  filter: any
  quizzesOfCourse: any
  user: ITMCProfile
}

const mapStateToProps = (state: any) => {
  return {
    answers: state.answers,
    courses: state.courses,
    edit: state.edit,
    filter: state.filter,
    quizzesOfCourse: state.quizzes.find(
      courseQuizInfo => courseQuizInfo.courseId === state.filter.course,
    ),
    user: state.user,
  }
}

const mapDispatchToProps = {
  addUser,
  displayMessage,
  newQuiz,
  setAnswerCounts,
  setCourse,
  setCourses,
  setEdit,
  removeUser,
}

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App)
