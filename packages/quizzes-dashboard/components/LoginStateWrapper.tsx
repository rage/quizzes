import React, { useContext } from "react"

import LoginStateContext from "../contexts/LoginStateContext"
import LoginView from "./LoginView"

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
