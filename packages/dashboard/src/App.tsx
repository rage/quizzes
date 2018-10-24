import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import TMCApi from '../../common/src/services/TMCApi'
import { ITMCProfile, ITMCProfileDetails } from "../../common/src/types"
import { setFilter } from './store/filter/actions'
import { setQuizzes } from './store/quizzes/actions'
import { addUser, removeUser } from './store/user/actions'

class App extends React.Component<any, any> {

  public async componentDidMount() {
    const user = TMCApi.checkStore()
    if (user) {
      const profile = await TMCApi.getProfile(user.accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
        this.props.setQuizzes()
      }
    }
  }

  public render() {

    const Login = () => {
      return (
        <div style={{ width: 200 }}>
          <form onSubmit={this.handleSubmit}>
            <FormControl>
              <InputLabel>Username</InputLabel>
              <Input name="username" />
            </FormControl>
            <FormControl >
              <InputLabel>Password</InputLabel>
              <Input name="password" type="password" />
            </FormControl>
            <Button type="submit">Sign in</Button>
          </form>
        </div>
      )
    }

    const Dashboard = () => {
      return (
        <div>
          <div>
            <AppBar>
              <Toolbar>
                <Button onClick={this.logout}>logout</Button>
              </Toolbar>
            </AppBar>
          </div>
          <div style={{ marginTop: 90 }}>
            <div style={{ padding: 20 }}>
              <Select value={this.props.filter || "cat"} onChange={this.handleSelect} style={{ minWidth: 120 }}>
                {this.props.courses.map(course => <MenuItem key={course} value={course}>{course}</MenuItem>)}
              </Select>
            </div>
            <Table>
              <TableBody>
                {this.props.quizzes.filter(quiz => quiz.courseId === this.props.filter).map(quiz => <TableRow key={quiz.id}><TableCell><Link to={`/quizzes/${quiz.id}`}>{quiz.texts[0].title}</Link></TableCell></TableRow>)}
              </TableBody>
            </Table>
          </div>
        </div>
      )
    }

    const Quiz = ({ match }) => {
      const quiz = this.props.quizzes.find(q => q.id === match.params.id)
      console.log(quiz)
      return (
        <div>
          <h2>{quiz.texts[0].title}</h2>
          <p>{quiz.texts[0].body}</p>
        </div>)
    }

    return (
      <div>
        <Router>
          {this.props.user ?
            <div>
              <Route exact={true} path='/' component={Dashboard} />
              <Route exact={true} path='/quizzes/:id' component={Quiz} />
            </div> :
            <div>
              <Route exact={true} path='/' component={Login} />
              <Route exact={true} path='/quizzes/:id' component={Login} />
            </div>}
        </Router>
      </div>
    );
  }

  private handleSelect = (event) => {
    this.props.setFilter(event.target.value)
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
        this.props.setQuizzes()
      }
    } catch (exception) {
      console.log('shiiiit')
    }
  }

  private logout = () => {
    TMCApi.unauthenticate()
    this.props.removeUser()
  }
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
  setFilter,
  setQuizzes,
  removeUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)