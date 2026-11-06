import * as React from "react"

import styled from "styled-components"

import { Container } from "@mui/material"

import { BreadCrumbs } from "../contexts/BreadCrumbContext"
import { LoginChecker } from "../contexts/LoginStateContext"
import Footer from "./Footer"
import LoginStateWrapper from "./LoginStateWrapper"
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
          <BreadCrumbs>
            <TopBar />
            <Container maxWidth="md">
              <LoginStateWrapper>{children}</LoginStateWrapper>
            </Container>
          </BreadCrumbs>
        </div>
        <Footer />
      </FooterDownPusherWrapper>
    </LoginChecker>
  )
}

export default Template
