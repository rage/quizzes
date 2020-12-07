import * as React from "react"
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import LoginStateContext from "../contexts/LoginStateContext"
import { useContext } from "react"
import { unauthenticate } from "../services/tmcApi"
import BreadCrumb from "./BreadCrumb"
interface TemplateProps {
  children?: React.ReactNode
}

const StyledAppBar = styled(AppBar)`
  margin-bottom: 2rem;
`

const EmptySpace = styled.div`
  flex: 1;
`

const FrontPageLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const TopBar = () => {
  const { loggedIn, setLoggedIn } = useContext(LoginStateContext)

  const handleLogout = () => {
    unauthenticate()
    setLoggedIn(false)
  }

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography>Quizzes</Typography>
        <EmptySpace />
        <BreadCrumb />
        <EmptySpace />
        {loggedIn && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </StyledAppBar>
  )
}

export default TopBar
