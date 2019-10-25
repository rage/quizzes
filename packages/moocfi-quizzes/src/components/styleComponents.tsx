import styled from "styled-components"
import { Button, Paper, TextField, Typography } from "@material-ui/core"

export const RedButton = styled(Button)`
  background-color: rgb(200, 34, 34);
  color: rgb(255, 255, 255);
`

export const SpaciousPaper = styled(Paper)`
  padding: 1rem;
  margin: 0.5rem;
`

export const SpaciousTypography = styled(Typography)`
  padding-bottom: 0.75rem;
`

interface IStyledTextFieldProps {
  rowNumber: number
}

export const StyledTextField = styled(TextField)<IStyledTextFieldProps>`
  background-color: ${props => (props.rowNumber === 2 ? "inherit" : "#fdfdff")};

  .MuiOutlinedInput-notchedOutline {
    border-color: #595959;
  }

  .MuiFormLabel-root {
    color: #595959;
  }
`


export const StyledButton = styled(Button)`
  padding: 10px 20px;
  border-radius: 15px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`

export const WhiteSpacePreservingTypography = styled(Typography)`
  white-space: pre-line;
`
