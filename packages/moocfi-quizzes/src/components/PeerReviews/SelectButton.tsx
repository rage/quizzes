import React from "react"

import { useTypedSelector } from "../../state/store"
import ThemeProviderContext from "../../contexes/themeProviderContext"

import { BaseButton } from "../styleComponents"

export interface SelectButtonProps {
  children: any
  onClick: any
  disabled?: boolean
}

const SelectButton: React.FunctionComponent<SelectButtonProps> = (props) => {
  const themeProvider = React.useContext(ThemeProviderContext)

  const error = useTypedSelector((state) => state.message.error)

  const ThemedButton = themeProvider.selectButton

  if (ThemedButton) {
    return <ThemedButton disabled={error} {...props} />
  }

  return (
    <BaseButton
      variant="contained"
      color="primary"
      disabled={error}
      onClick={props.onClick}
    >
      {...props.children}
    </BaseButton>
  )
}

export default SelectButton
