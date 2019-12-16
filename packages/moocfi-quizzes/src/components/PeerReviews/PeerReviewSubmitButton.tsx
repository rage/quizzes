import React from "react"
import { StyledButton } from "../styleComponents"
import ThemeProviderContext from "../../contexes/themeProviderContext"

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
    <StyledButton
      variant="contained"
      color="primary"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {...props.children}
    </StyledButton>
  )
}

export default PeerReviewSubmitButton
