import React from "react"
import { useState } from "react"
import styled from "styled-components"
import { Typography, TextField, Button } from "@material-ui/core"
import { authenticate, getProfile } from "../services/tmcApi"
import { useDispatch } from "react-redux"
import { setUser } from "../store/user/userActions"

const LoginContainer = styled.div`
  display: flex;
  padding: 1rem;
`

const LoginView = () => {
  const dispatch = useDispatch()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const res = await authenticate({ username: userName, password: password })
    if (res.accessToken) {
      const userInfo = await getProfile(res.accessToken)
      dispatch(setUser(res.username, res.accessToken, userInfo.administrator))
    }
    setUserName("")
    setPassword("")
  }

  return (
    <>
      <form>
        <LoginContainer>
          <Typography>Username/Email</Typography>
          <TextField
            type="text"
            onChange={event => setUserName(event.target.value)}
          />
        </LoginContainer>
        <LoginContainer>
          <Typography>Password</Typography>
          <TextField
            type="password"
            onChange={event => setPassword(event.target.value)}
          />
        </LoginContainer>
        <Button onClick={handleLogin}>Login</Button>
      </form>
    </>
  )
}

export default LoginView
