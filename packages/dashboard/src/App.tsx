import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import TMCApi from '@quizzes/common/src/services/TMCApi'
import { ITMCProfile, ITMCProfileDetails } from "@quizzes/common/src/types"
import * as React from 'react'

interface IAppState {
  user?: ITMCProfile
}

class App extends React.Component<any, IAppState> {

  constructor(props: any) {
    super(props)
    this.state = {
      user: undefined
    }
  }

  public render() {
    const form = () => {
      return (
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
      )
    }

    return (
      <div>
        {this.state.user ? <Button onClick={this.logout}>logout</Button> : form()}
      </div>
    );
  }

  public async componentDidMount() {
    // const user = TMCApi.checkStore()
    // if (user) {
    //   const profile: ITMCProfileDetails = await TMCApi.getProfile(user.accessToken)
    //   console.log(profile)
    //   if (profile.administrator) {
    //     this.setState({
    //       user
    //     })
    //   }
    // }
  }

  private handleSubmit = async (event: any) => {
    try {
      event.preventDefault()
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ''
      event.target.password.value = ''
      const user = await TMCApi.authenticate({ username, password })
      const accessToken = user.accessToken
      const profile = await TMCApi.getProfile(accessToken)
      if (profile.administrator) {
        this.setState({ user })
      }
    } catch (exception) {
      console.log('shiiiit')
    }
  }

  private logout = () => {
    TMCApi.unauthenticate()
    this.setState({
      user: undefined
    })
  }
}

export default App;
