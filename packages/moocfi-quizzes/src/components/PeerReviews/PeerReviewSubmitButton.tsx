import React from "react"
import styled from "styled-components"

import ThemeProviderContext from "../../contexes/themeProviderContext"

import { StyledButton } from "../styleComponents"

const SubmitButton = styled(StyledButton)`
  margin: 2rem 0 0;
`

export interface PeerReviewSubmitButtonProps {
  children: any
  disabled: boolean
  onClick: any
}

const PeerReviewSubmitButton: React.FunctionComponent<
  PeerReviewSubmitButtonProps
> = props => {
  const themeProvider = React.useContext(ThemeProviderContext)

  const ThemedButton = themeProvider.peerReviewSubmitButton

  if (ThemedButton) {
    return <ThemedButton {...props} />
  }

  return (
    <SubmitButton
      variant="contained"
      color="primary"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {...props.children}
    </SubmitButton>
  )
}

export default PeerReviewSubmitButton
