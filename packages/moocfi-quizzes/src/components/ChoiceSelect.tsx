import * as React from "react"
import { useContext } from "react"
import { MenuItem } from "@material-ui/core"
import ThemeProviderContext from "../contexes/themeProviderContext"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"

import { StyledButton } from "./styleComponents"

export interface ChoiceButtonProps {
  revealed: boolean
  children: any
  selected: boolean
  correct: boolean
  onClick?: any
  disabled?: boolean
}

interface ButtonProps {
  selected: boolean
}

interface RevealedButtonProps {
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

const ChoiceButton = styled(MenuItem)<ButtonProps>`
  ${({ selected }) => !selected && `background-color: white;`}
    ${({ selected }) => (selected ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.23)")};
`

const RevealedChoiceButton = styled(
  ({ selected, correct, ...others }: RevealedButtonProps) => {
    return (
      <ChoiceButton
        selected={selected}
        {...others}
      >
        {selected ? correct ? <SuccessIcon /> : <FailureIcon /> : ""}
        {others.children}
      </ChoiceButton>
    )
  },
)`
  ${props =>
    props.selected
      ? `
      color: white;
      background-color: ${props.correct ? "#047500" : "#DB0000"};
      `
      : props.correct
      ? `
      color: #047500;
      border-color: #047500;
      border-width: 3px
      `
      : ``}
`

export default (props: ChoiceButtonProps) => {
  const themeProvider = useContext(ThemeProviderContext)
  const { revealed, ...others } = props
  const ThemedButton = themeProvider.choiceButton

  if (ThemedButton) {
    return <ThemedButton {...props} onlyOneItem={false}/>
  }

  return revealed ? (
    <RevealedChoiceButton {...others} />
  ) : (
    <ChoiceButton
      color={props.selected ? "primary" : "default"}
      {...others}
    />
  )
}
