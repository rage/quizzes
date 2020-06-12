import React from "react"
import { RedButton } from "../styleComponents"
import ThemeProviderContext from "../../contexes/themeProviderContext"

export interface SpamButtonProps {
  children: any
  onClick: any
  disabled: boolean
}

const SpamButton: React.FunctionComponent<SpamButtonProps> = (props) => {
  const themeProvider = React.useContext(ThemeProviderContext)

  const ThemedButton = themeProvider.spamButton

  if (ThemedButton) {
    return <ThemedButton {...props} />
  }

  return (
    <RedButton
      variant="contained"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {...props.children}
    </RedButton>
  )
}

export default SpamButton
