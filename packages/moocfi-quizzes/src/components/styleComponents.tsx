import styled from "styled-components"
import { Paper, TextField, Typography } from "@material-ui/core"

export const SpaciousPaper = styled(Paper)`
  padding: 1rem;
  margin: 0.5rem;
`

export const SpaciousTypography = styled(Typography)`
  padding-bottom: 0.75rem;
`

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-notchedOutline {
    border-color: #595959;
  }

  .MuiFormLabel-root {
    color: #595959;
  }
`
