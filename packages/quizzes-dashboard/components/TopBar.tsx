import * as React from "react"
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core"
import styled from "styled-components"
import LoginStateContext from "../contexts/LoginStateContext"
import { useContext } from "react"
import { unauthenticate } from "../services/tmcApi"
import BreadCrumb from "./BreadCrumb"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

const StyledAppBar = styled(AppBar)``

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
    <>
      <StyledAppBar elevation={0} position="sticky">
        <Toolbar>
          <Link href="/">
            <LinkWrapper>
              <Typography style={{ fontSize: "22px", fontWeight: "bold" }}>
                Quizzes
              </Typography>
            </LinkWrapper>
          </Link>
          <EmptySpace />
          <EmptySpace />
          {loggedIn && (
            <>
              <Button
                style={{ fontWeight: "bold" }}
                color="inherit"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <p style={{ marginLeft: "6px" }}>Logout</p>
              </Button>
            </>
          )}
        </Toolbar>
        {loggedIn && <BreadCrumb />}
      </StyledAppBar>
    </>
  )
}

export default TopBar
