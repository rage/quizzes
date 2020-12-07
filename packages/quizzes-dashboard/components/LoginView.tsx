import React, { useContext } from "react"
import { useState } from "react"
import styled from "styled-components"
import {
  Typography,
  TextField,
  Button,
  Card,
  Snackbar,
} from "@material-ui/core"
import { authenticate } from "../services/tmcApi"
import Alert from "@material-ui/lab/Alert"
import LoginStateContext from "../contexts/LoginStateContext"
import useBreadcrumbs from "../hooks/useBreadcrumbs"

const LoginFieldContainer = styled.div`
  left: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
`
const LabelContainer = styled.div`
  display: flex;
  padding: 1rem;
  float: center;
  margin: auto;
`

const ButtonContainer = styled.div`
  display: flex;
  padding: 1rem;
  float: right;
`
const TextFieldContainer = styled.div`
  display: flex;
  padding: 1rem;
`

const LoginView = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const { setLoggedIn } = useContext(LoginStateContext)

  const handleLogin = async () => {
    const res = await authenticate({ username: userName, password: password })
    if (res.accessToken) {
      setLoggedIn(true)
    } else {
      setError(true)
    }
    setUserName("")
    setPassword("")
  }
  useBreadcrumbs([])

  return (
    <>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setError(false)}
      >
        <Alert severity="error" onClose={() => setError(false)}>
          Something went wrong, couldn't log in
        </Alert>
      </Snackbar>
      <form>
        <Card>
          <LoginFieldContainer>
            <LabelContainer>
              <Typography variant="h5">
                Please log in with your MOOC.fi account
              </Typography>
            </LabelContainer>
          </LoginFieldContainer>
          <LoginFieldContainer>
            <TextFieldContainer>
              <TextField
                value={userName}
                fullWidth={true}
                size="medium"
                type="text"
                variant="outlined"
                label="Email or username"
                autoComplete="username"
                onChange={event => setUserName(event.target.value)}
              />
            </TextFieldContainer>
            <TextFieldContainer>
              <TextField
                value={password}
                fullWidth={true}
                size="medium"
                type="password"
                variant="outlined"
                label="Password"
                autoComplete="current-password"
                onChange={event => setPassword(event.target.value)}
              />
            </TextFieldContainer>
          </LoginFieldContainer>
          <ButtonContainer>
            <Button size="large" variant="outlined" onClick={handleLogin}>
              Login
            </Button>
          </ButtonContainer>
        </Card>
      </form>
    </>
  )
}

export default LoginView
