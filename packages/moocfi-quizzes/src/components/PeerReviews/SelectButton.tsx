import React from "react"

import ThemeProviderContext from "../../contexes/themeProviderContext"

import { BaseButton } from "../styleComponents"

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
    <BaseButton variant="contained" color="primary" onClick={props.onClick}>
      {...props.children}
    </BaseButton>
  )
}

export default SelectButton
