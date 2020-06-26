import * as React from "react"
import { Container } from "@material-ui/core"
import styled from "styled-components"
import Footer from "./Footer"
import LoginStateWrapper from "./LoginStateWrapper"
import { LoginChecker } from "../contexts/LoginStateContext"
import TopBar from "./TopBar"

interface TemplateProps {
  children?: React.ReactNode
}

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Template = ({ children }: TemplateProps) => {
  return (
    <LoginChecker>
      <FooterDownPusherWrapper>
        <div>
          <TopBar />
          <Container maxWidth="md">
            <LoginStateWrapper>{children}</LoginStateWrapper>
          </Container>
        </div>
        <Footer />
      </FooterDownPusherWrapper>
    </LoginChecker>
  )
}

export default Template
