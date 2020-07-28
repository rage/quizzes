import { createContext, useState, useEffect } from "react"

interface LoginStateContextType {
  loggedIn: boolean | null
  setLoggedIn: (value: boolean) => void
}

const loginStateContextDefaultImpl = {
  loggedIn: null,
  setLoggedIn: () => {},
}

const LoginStateContext = createContext<LoginStateContextType>(
  loginStateContextDefaultImpl,
)

export const LoginChecker = ({ children }: { children: any }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    let accessToken: string | undefined = undefined
    const credentialsString = localStorage["tmc.user"]
    if (credentialsString) {
      accessToken = JSON.parse(credentialsString).accessToken
    }
    setLoggedIn(Boolean(accessToken))
  })

  return (
    <LoginStateContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoginStateContext.Provider>
  )
}

export default LoginStateContext
