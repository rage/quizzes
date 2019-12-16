import React from "react"
import { Button } from "@material-ui/core"
import ThemeProviderContext from "../../contexes/themeProviderContext"

export interface SelectButtonProps {
  children: any
  onClick: any
}

const SelectButton: React.FunctionComponent<SelectButtonProps> = props => {
  const themeProvider = React.useContext(ThemeProviderContext)

  const ThemedButton = themeProvider.selectButton

  if (ThemedButton) {
    return <ThemedButton {...props} />
  }

  return (
    <Button variant="contained" color="primary" onClick={props.onClick}>
      {...props.children}
    </Button>
  )
}

export default SelectButton
