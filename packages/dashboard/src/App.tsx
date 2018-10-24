import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
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
            <div style={{ marginBottom: 20, marginLeft: 20 }}>
              <Select value={this.props.filter || "cat"} onChange={this.handleSelect} style={{ minWidth: 350 }}>
                {this.props.courses.map(course => <MenuItem key={course} value={course}>{course}</MenuItem>)}
              </Select>
            </div>
            <Table>
              <TableBody>
                {this.props.quizzes.filter(quiz => quiz.courseId === this.props.filter)
                  .map(quiz => <TableRow key={quiz.id}><TableCell><Link to={`/quizzes/${quiz.id}`}>{quiz.texts[0].title}</Link></TableCell></TableRow>)}
              </TableBody>
            </Table>
          </div>
        </div>
      )
    }

    const Quiz = ({ match }) => {
      const quiz = this.props.quizzes.find(q => q.id === match.params.id)
      console.log(quiz)
      if (!quiz) {
        return <p>loading..</p>
      }
      return (
        <div>
          <Typography variant='headline' gutterBottom={true}>{quiz.texts[0].title}</Typography>
          <Typography variant='body1'>{quiz.texts[0].body}</Typography>
        </div>)
    }

    return (
      <div>
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
                <div style={{ height: 80 }}/>
              </div>
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