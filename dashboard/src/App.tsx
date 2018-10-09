import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import * as React from 'react';
import TMCApi from './services/TMCApi'
import { ITMCProfile, ITMCProfileDetails, ITMCLoginCredentials } from "./types"

class App extends React.Component {

  public handleSubmit = async (event: any) => {
    try {
      event.preventDefault()
      const username = event.target.username.value 
      const password = event.target.password.value 
      event.target.username.value = ''
      event.target.password.value = ''
      const res = await TMCApi.authenticate({ username, password })
      const accessToken = res.accessToken
      console.log(res)
      const prof = await TMCApi.getProfile(accessToken)
      console.log(prof) 
    } catch (exception) {
      console.log('shiiit')
    }
  }

  public render() {
    return (
      <div>
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
    );
  }
}



export default App;
