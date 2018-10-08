import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import * as React from 'react';
import TMCApi from './services/TMCApi'

class App extends React.Component {

  public handleSubmit = async (event: any) => {
    console.log("hop")
    const res = await TMCApi.authenticate({ username: event.target.username.value, password: event.target.password.value })
    console.log(res)
  }

  public render() {
    console.log("hip")
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormControl>
            <InputLabel>Username</InputLabel>
            <Input name="username" />
          </FormControl>
          <FormControl >
            <InputLabel>Password</InputLabel>
            <Input name="password" type="password"/>
          </FormControl>
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    );
  }
}



export default App;
