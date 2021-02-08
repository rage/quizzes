import * as React from "react"
import { useContext } from "react"
import ThemeProviderContext from "../contexes/themeProviderContext"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"

import { SecondaryStyledButton } from "./styleComponents"

// create a state that manage the no. of selected button
// if the number of selected are more than 5
// disable all other buttons apart from the selected

export interface ChoiceButtonProps {
  revealed: boolean
  children: any
  onlyOneItem: boolean
  state: boolean
  selected: boolean
  correct: boolean
  onClick?: any
  disabled?: boolean
}

interface ButtonProps {
  onlyOneItem: boolean
  selected: boolean
  state: boolean
}

interface RevealedButtonProps {
  onlyOneItem: boolean
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

const ChoiceButton = styled(SecondaryStyledButton)<ButtonProps>`
  ${({ onlyOneItem }) => onlyOneItem && `width: 90%;`}
  ${({ state }) => state && `background-color: #E3B599;`}

  margin: 0.5em 0;

  &:hover {
    background: #e5c7b5;
    box-shadow: none;
  }

  &:focus {
    ${({ state }) =>
      state ? `background-color: #E3B599;` : `background-color: #E0E0E0;`}
  }
`

const RevealedChoiceButton = styled(
  ({ selected, correct, ...others }: RevealedButtonProps) => {
    return (
      <ChoiceButton
        state={false} // TODO
        variant={"contained"}
        selected={selected}
        fullWidth
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
      color: #fff;
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
    return <ThemedButton {...props} />
  }

  return revealed ? (
    <RevealedChoiceButton {...others} />
  ) : (
    <ChoiceButton variant="contained" fullWidth {...others} />
  )
}
