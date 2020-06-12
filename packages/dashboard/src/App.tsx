import AppBar from "@material-ui/core/AppBar"
import Breadcrumbs from "@material-ui/core/Breadcrumbs"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import Paper from "@material-ui/core/Paper"
import SvgIcon from "@material-ui/core/SvgIcon"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Build from "@material-ui/icons/Build"
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import * as React from "react"
import { connect } from "react-redux"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"
import QuizStatistics from "./components/Answers/QuizStatistics"
import CoursesView from "./components/CoursesView"
import QuizForm from "./components/QuizForm"
import RolesView from "./components/RolesView"
import SingleCourseView from "./components/SingleCourseView"
import SuccessNotification from "./components/SuccessNotification"
import { ITMCProfile, ITMCProfileDetails } from "./interfaces"
import TMCApi from "./services/TMCApi"
import { setAnswerCounts } from "./store/answerCounts/actions"
import { setCourses } from "./store/courses/actions"
import { newQuiz, setEdit } from "./store/edit/actions"
import { setCourse, setLanguage, setQuiz } from "./store/filter/actions"
import { displayMessage } from "./store/notification/actions"
import { setQuizzesByQuizId } from "./store/quizzes/actions"
import { addUser, removeUser } from "./store/user/actions"
import { InitializationStatus, IUserState } from "./store/user/reducer"

class App extends React.Component<any, any> {
  public async componentDidMount() {
    const user = TMCApi.checkStore()

    if (user) {
      const profile = await TMCApi.getProfile(user.accessToken)
      if (profile.id) {
        // (profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user, profile.administrator)
      }
    }
  }

  public currentCourse = () => {
    if (!this.props.filter.course) {
      return null
    }
    return this.props.courses.find((c) => c.id === this.props.filter.course)
  }

  public currentQuizTitle: () => string | null = () => {
    if (!this.props.filter.quiz || !this.props.quizzesOfCourse) {
      return null
    }

    const quiz = this.props.quizzesOfCourse.quizzes.find(
      (q) => q.id === this.props.filter.quiz,
    )
    return quiz ? quiz.texts[0].title : null
  }

  public render() {
    const developmentEnvironment = process.env.NODE_ENV === "development"

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

    if (
      this.props.user.initializationStatus === InitializationStatus.INITIALIZING
    ) {
      return <div>Logging in...</div>
    }

    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Router>
          <React.Fragment>
            <SuccessNotification />
            {this.props.user.accessToken ? (
              <div>
                <div>
                  <AppBar
                    style={{
                      backgroundColor: developmentEnvironment
                        ? "#227722"
                        : "default",
                    }}
                  >
                    <Toolbar>
                      <Grid
                        container={true}
                        justify="space-between"
                        alignItems="center"
                        spacing={8}
                      >
                        <Grid item={true} xs={12} sm={6}>
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

                        <Grid item={true} xs={12} sm={6}>
                          <Grid
                            container={true}
                            justify="flex-end"
                            alignItems="center"
                            spacing={3}
                          >
                            {developmentEnvironment && (
                              <Grid item={true}>
                                <SvgIcon
                                  style={{
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <Build />
                                </SvgIcon>
                              </Grid>
                            )}
                            <Grid item={true}>
                              <Link
                                to="/roles"
                                style={{
                                  textDecoration: "none",
                                  maxWidth: developmentEnvironment
                                    ? "33%"
                                    : "50%",
                                }}
                              >
                                <Typography
                                  align="center"
                                  style={{
                                    color: "#FFFFFF",
                                    display: "inline",
                                  }}
                                  variant="subtitle1"
                                >
                                  My roles
                                </Typography>
                              </Link>
                            </Grid>

                            <Grid>
                              <Button
                                color="inherit"
                                onClick={this.logout}
                                style={{
                                  maxWidth: developmentEnvironment
                                    ? "33%"
                                    : "50%",
                                }}
                              >
                                logout
                              </Button>
                            </Grid>
                          </Grid>
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
                <Route exact={true} path="/roles" component={RolesView} />
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
              <Route exact={false} path="/" component={Login} />
            )}
          </React.Fragment>
        </Router>
      </div>
    )
  }

  private PathBreadcrumbs = (props) => {
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

        {
          // not a fourth, but an alternative to the third
          onAnswerPage &&
            Crumbify(
              `/quizzes/${this.props.filter.quiz}/answers`,
              this.currentQuizTitle(),
            )()
        }
      </Breadcrumbs>
    )
  }

  private edit = ({ history, match }) => {
    const quizIdInPath = match.params.id

    let quiz

    // Best case: quiz is on the current course
    if (this.props.quizzesOfCourse) {
      quiz =
        this.props.quizzesOfCourse.quizzes &&
        this.props.quizzesOfCourse.quizzes.find((q) => q.id === match.params.id)
    }

    const quizzesByCourses = this.props.quizzesByCourses
    // Second best: quiz loaded in memory, but under another course
    if (!quiz) {
      quizzesByCourses.forEach((courseInfo) => {
        if (quiz) {
          return
        }
        const possibleQuizOnCourse = courseInfo.quizzes.find(
          (q) => q.id === quizIdInPath,
        )
        if (possibleQuizOnCourse) {
          quiz = possibleQuizOnCourse
          // ja ehkä myös nykyisten kurssien siirtyminen sopivaan uuteen quizziiin?
        }
      })
    }

    // Worst case: quiz info must be fetched from the backend (and initiate loading the info of that course)
    // prob best to load something while waiting, but let's try if this even works...
    if (!quiz) {
      if (this.props.currentlySettingQuizzes.size <= 0) {
        this.props.setQuizzesByQuizId(quizIdInPath)
      }
      return <p />
    }

    if (this.props.filter.quiz !== quizIdInPath) {
      this.props.setQuiz(quizIdInPath)
      if (
        quiz.texts[0].language &&
        this.props.filter.language !== quiz.texts[0].language
      ) {
        this.props.setLanguage(quiz.texts[0].language)
      }
      if (this.props.filter.course !== quiz.courseId) {
        this.props.setCourse(quiz.courseId)
      }

      return <p />
    }

    return <QuizForm quiz={quiz} new={false} history={history} />
  }

  private create = ({ history }) => {
    if (this.props.courses.length === 0) {
      return <p />
    }
    return <QuizForm history={history} new={true} />
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
      if ((profile as ITMCProfileDetails).id) {
        this.props.addUser(user, profile.administrator, true)
      }
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
  setCourses: typeof setCourses
  setEdit: typeof setEdit
  removeUser: typeof removeUser
}

interface IStateProps {
  courses: any
  currentlySettingQuizzes: Set<string>
  edit: any
  filter: any
  quizzesOfCourse: any
  quizzesByCourses: any[]
  user: IUserState
}

const mapStateToProps = (state: any) => {
  return {
    answers: state.answers,
    courses: state.courses,
    edit: state.edit,
    filter: state.filter,
    quizzesOfCourse: state.quizzes.courseInfos.find(
      (courseQuizInfo) => courseQuizInfo.courseId === state.filter.course,
    ),
    quizzesByCourses: state.quizzes.courseInfos,
    user: state.user,
    currentlySettingQuizzes: state.quizzes.currentlySetting,
  }
}

const mapDispatchToProps = {
  addUser,
  displayMessage,
  newQuiz,
  setAnswerCounts,
  setCourses,
  setEdit,
  removeUser,
  setQuizzesByQuizId,
  setQuiz,
  setLanguage,
  setCourse,
}

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(App)
