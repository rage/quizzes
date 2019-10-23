import styled from "styled-components"
import { Paper, TextField, Typography } from "@material-ui/core"

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

export const WhiteSpacePreservingTypography = styled(Typography)`
  white-space: pre-line;
`
