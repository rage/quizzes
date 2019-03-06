import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Redirect, Route } from 'react-router-dom'
import TMCApi from '../../common/src/services/TMCApi'
import { ITMCProfile, ITMCProfileDetails } from "../../common/src/types"
import QuizForm from './components/QuizForm'
import { setCourses } from './store/courses/actions'
import { newQuiz, setEdit } from './store/edit/actions'
import { setCourse } from './store/filter/actions'
import { setQuizzes } from './store/quizzes/actions'
import { addUser, removeUser } from './store/user/actions'


class App extends React.Component<any, any> {

  public async componentDidMount() {
    const user = TMCApi.checkStore()
    if (user) {
      const profile = await TMCApi.getProfile(user.accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
        this.props.setCourses()
      }
    }
  }

  public render() {

    const Login = () => {
      return (
        <Grid container={true} justify='center'>
          <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 150px 100px', marginTop: 100 }}>
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" fullWidth={true}>
                <InputLabel>Username</InputLabel>
                <Input name="username" />
              </FormControl>
              <FormControl margin="normal" fullWidth={true}>
                <InputLabel>Password</InputLabel>
                <Input name="password" type="password" />
              </FormControl>
              <Button type="submit" variant='contained' style={{ marginTop: 30 }} fullWidth={true}>Sign in</Button>
            </form>
          </Paper>
        </Grid>
      )
    }

    const Dashboard = () => {
      return (
        <div>
          <div>
            <Toolbar style={{ marginBottom: 20 }}>
              <Select value={this.props.filter.course || ''} onChange={this.handleSelect} style={{ minWidth: 350 }}>
                {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.texts[0].title}</MenuItem>)}
              </Select>
              <Typography style={{ flex: 1 }} />
              {this.props.filter.course === "" ? <p/> : <Link to='/new' style={{ textDecoration: 'none' }}><Button>New quiz</Button></Link> }
            </Toolbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography>Title</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.quizzes.filter(quiz => quiz.course.id === this.props.filter.course)
                  .map(quiz => <TableRow key={quiz.id}><TableCell><Link to={`/quizzes/${quiz.id}`}>{quiz.texts[0] ? quiz.texts[0].title : "no title"}</Link></TableCell></TableRow>)}
              </TableBody>
            </Table>
          </div>
        </div>
      )
    }

    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Router>
          {this.props.user ?
            <div>
              <div>
                <AppBar >
                  <Toolbar>
                    <Typography style={{ flex: 1 }} />
                    <Button onClick={this.logout}>logout</Button>
                  </Toolbar>
                </AppBar>
                <div style={{ height: 80 }} />
              </div>
              <Route exact={true} path='/' component={Dashboard} />
              <Route exact={true} path='/quizzes/:id' component={this.edit} />
              <Route exact={true} path='/new' component={this.create} />
            </div> :
            <div>
              <Route exact={true} path='/' component={Login} />
              <Route exact={true} path='/quizzes/:id' component={Login} />
              <Route exact={true} path='/new' component={Login} />
            </div>}
        </Router>
      </div>
    );
  }

  private edit = ({ match }) => {
    if (this.props.quizzes.length === 0) {
      return <p />
    }
    const quiz = this.props.quizzes.find(q => q.id === match.params.id)
    return <QuizForm quiz={quiz} new={false}/>
  }

  private create = () => {
    if (this.props.courses.length === 0) {
      return <p />
    }
    return <QuizForm />
  }

  private handleSelect = (event) => {
    this.props.setCourse(event.target.value)
  }

  private handleSubmit = async (event: any) => {
    try {
      event.preventDefault()
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ''
      event.target.password.value = ''
      const user: ITMCProfile = await TMCApi.authenticate({ username, password })
      const accessToken = user.accessToken
      const profile = await TMCApi.getProfile(accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
        this.props.setCourses()
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  private logout = () => {
    TMCApi.unauthenticate()
    this.props.removeUser()
  }
}

interface IDispatchProps {
  addUser: typeof addUser,
  newQuiz: typeof newQuiz,
  setCourse: typeof setCourse,
  setCourses: typeof setCourses,
  setEdit: typeof setEdit,
  setQuizzes: typeof setQuizzes,
  removeUser: typeof removeUser
}

interface IStateProps {
  courses: any,
  quizzes: any[],
  user: ITMCProfile
}

const mapStateToProps = (state: any) => {
  return {
    courses: state.courses,
    filter: state.filter,
    quizzes: state.quizzes,
    user: state.user
  }
}

const mapDispatchToProps = {
  addUser,
  newQuiz,
  setCourse,
  setCourses,
  setEdit,
  setQuizzes,
  removeUser
}

export default connect<IStateProps, IDispatchProps>(mapStateToProps, mapDispatchToProps)(App)