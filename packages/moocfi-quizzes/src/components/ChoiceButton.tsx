import * as React from "react"
import { useContext } from "react"
import ThemeProviderContext from "../contexes/themeProviderContext"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"

import { UpdatedStyledButton } from "./styleComponents"

export interface ChoiceButtonProps {
  revealed: boolean
  children: any
  onlyOneItem: boolean
  selected: boolean
  correct: boolean
  onClick?: any
  disabled?: boolean
}

interface ButtonProps {
  onlyOneItem: boolean
  selected: boolean
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

const ChoiceButton = styled(UpdatedStyledButton)<ButtonProps>`
  ${({ onlyOneItem }) => onlyOneItem && `width: 70%;`}
  ${({ selected }) =>
    !selected
      ? `background-color: transparent;`
      : `{background-color: white; color: #1373E6; font-weight: 500; border: 1px solid white; box-shadow: 0 1.6px 1.3px -6px rgba(0,0,0,0.022), 0 4px 3.3px -6px rgba(0,0,0,0.031), 0 8.2px 6.7px -6px rgba(0,0,0,0.039), 0 16.8px 13.9px -6px rgba(0,0,0,0.048), 0 46px 38px -6px rgba(0,0,0,0.07);}`}

  margin: 0.5em 0;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  padding: 1rem 4rem;
  border: 2px solid #dce1e4;
  transition: all 0.15s ease-in;
  font-family: Poppins;

  &:hover {
    color: rgba(0, 0, 0, 0.9);
    font-weight: 500;
    background: white;
    border: 1px solid white;
    box-shadow: 0 1.6px 1.3px -6px rgba(0, 0, 0, 0.055),
      0 4px 3.3px -6px rgba(0, 0, 0, 0.031),
      0 8.2px 6.7px -6px rgba(0, 0, 0, 0.039),
      0 16.8px 13.9px -6px rgba(0, 0, 0, 0.048),
      0 46px 38px -6px rgba(0, 0, 0, 0.07);
  }
`

const RevealedChoiceButton = styled(
  ({ selected, correct, ...others }: RevealedButtonProps) => {
    return (
      <ChoiceButton
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
    return <ThemedButton {...props} />
  }

  return revealed ? (
    <RevealedChoiceButton {...others} />
  ) : (
    <ChoiceButton
      variant="contained"
      color={props.selected ? "primary" : "default"}
      fullWidth
      {...others}
      disableRipple
    />
  )
}
