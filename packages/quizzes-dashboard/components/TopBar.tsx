import * as React from "react"
import { useContext } from "react"

import Link from "next/link"
import styled from "styled-components"
import { useSWRConfig } from "swr"

import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AppBar, Toolbar, Button, Typography } from "@mui/material"

import LoginStateContext from "../contexts/LoginStateContext"
import { unauthenticate } from "../services/tmcApi"
import BreadCrumb from "./BreadCrumb"

const StyledAppBar = styled(AppBar)``

const EmptySpace = styled.div`
  flex: 1;
`

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
`

const TopBar = () => {
  const { loggedIn, setLoggedIn } = useContext(LoginStateContext)
  const { mutate } = useSWRConfig()

  const handleLogout = () => {
    unauthenticate()
    // SWR keys don't include the user, so the next user would see this user's cached responses
    mutate(() => true, undefined, { revalidate: false })
    setLoggedIn(false)
  }

  return (
    <>
      <StyledAppBar elevation={0} position="sticky">
        <Toolbar>
          <HomeLink href="/">
            <Typography style={{ fontSize: "22px", fontWeight: "bold" }}>
              Quizzes
            </Typography>
          </HomeLink>
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
