import * as React from "react"
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import LoginStateContext from "../contexts/LoginStateContext"
import { useContext } from "react"
import { unauthenticate } from "../services/tmcApi"
import BreadCrumb from "./BreadCrumb"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

const StyledAppBar = styled(AppBar)`
  margin-bottom: 2rem;
`

const EmptySpace = styled.div`
  flex: 1;
`

const LinkWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
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
        <Link href="/">
          <LinkWrapper>
            <Typography>Quizzes</Typography>
            <FontAwesomeIcon icon={faHome} style={{ marginLeft: "0.5rem" }} />
          </LinkWrapper>
        </Link>
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
