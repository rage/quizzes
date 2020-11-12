import * as React from "react"
import { useContext } from "react"
import { MenuItem } from "@material-ui/core"
import ThemeProviderContext from "../contexes/themeProviderContext"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"

export interface MenuItemProps {
  revealed: boolean
  children: any
  value: any
  selected: boolean
  correct: boolean
  onClick?: any
  disabled?: boolean
}

interface ButtonProps {
  selected: boolean
}

interface RevealedMenuItemProps {
  selected: boolean
  correct: boolean
  children: any
}

const IconWrapper = styled.div`
  margin: 0.5rem;
`

const SuccessIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faCheck} />
  </IconWrapper>
)

const FailureIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faTimes} />
  </IconWrapper>
)

const StyledMenuItem = styled.span<ButtonProps>`
`

const RevealedMenuItem = styled(
  ({ selected, correct, ...others }: RevealedMenuItemProps) => {
    return (
      <StyledMenuItem selected={selected} {...others}>
        {selected ? correct ? <SuccessIcon /> : <FailureIcon /> : ""}
        {others.children}
      </StyledMenuItem>
    )
  },
)`
  ${props =>
    props.selected
      ? `
      color: blue;
 /*      background-color: ${props.correct ? "#047500" : "#DB0000"}; */
      `
      : props.correct
      ? `
      color: #047500;
      border-color: #047500;
      border-width: 3px
      `
      : ``}
`

export default (props: MenuItemProps) => {
  const themeProvider = useContext(ThemeProviderContext)
  const { revealed, ...others } = props
  const ThemedMenuItem = themeProvider.menuItem

  if (ThemedMenuItem) {
    return <ThemedMenuItem {...props} />
  }

  return revealed ? (
    <RevealedMenuItem {...others} />
  ) : (
    <StyledMenuItem
      color={props.selected ? "primary" : "default"}
      {...others}
    />
  )
}
