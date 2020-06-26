import React, { useContext } from "react"
import LoginView from "./LoginView"
import LoginStateContext from "../contexts/LoginStateContext"

interface Props {
  children: any
}

const LoginStateWrapper = ({ children }: Props) => {
  const { loggedIn } = useContext(LoginStateContext)

  if (loggedIn === null) {
    return null
  }

  if (!loggedIn) {
    return <LoginView />
  }

  return <>{children}</>
}

export default LoginStateWrapper
