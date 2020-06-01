import * as React from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Container,
} from "@material-ui/core"
import styled from "styled-components"
import Footer from "./Footer"
import Link from "next/link"

interface TemplateProps {
  children?: React.ReactNode
}

const StyledAppBar = styled(AppBar)`
  margin-bottom: 2rem;
`

const EmptySpace = styled.div`
  flex: 1;
`

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const FrontPageLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const Template = ({ children }: TemplateProps) => (
  <FooterDownPusherWrapper>
    <div>
      <StyledAppBar position="sticky">
        <Toolbar>
          <Link href="/">
            <FrontPageLink>
              <Typography variant="h6">Quizzes</Typography>
            </FrontPageLink>
          </Link>
          <EmptySpace />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="md">{children}</Container>
    </div>
    <Footer />
  </FooterDownPusherWrapper>
)

export default Template