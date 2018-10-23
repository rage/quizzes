import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
// import Paper from '@material-ui/core/Paper'
import * as React from 'react'
import { connect } from 'react-redux'
import TMCApi from './services/TMCApi'
import { addUser, removeUser } from './store/user/actions'
import { ITMCProfile, ITMCProfileDetails } from "../../../common/src/types"

class App extends React.Component<any, any> {

  public async componentDidMount() {
    const user = TMCApi.checkStore()
    if (user) {
      const profile = await TMCApi.getProfile(user.accessToken)
      if ((profile as ITMCProfileDetails).administrator) {
        this.props.addUser(user)
      }
    }
  }

  public handleSubmit = async (event: any) => {
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
      }
    } catch (exception) {
      console.log('shiiiit')
    }
  }

  public logout = () => {
    TMCApi.unauthenticate()
    this.props.removeUser()
  }

  public render() {

    const form = () => {
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

    const dash = () => {
      return (
        <Button onClick={this.logout}>logout</Button>
      )
    }

    return (
      <div>
        {this.props.user ? dash() : form()}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  addUser,
  removeUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)