import styled from "styled-components"
import {
  Button,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core"

export const BaseButton = styled(Button)`
  text-transform: none;
`

export const BoldTypography = styled(Typography)`
  font-weight: bold;
`

export const RedButton = styled(BaseButton)`
  background-color: rgb(200, 34, 34);
  color: rgb(255, 255, 255);
`

export const FlexContainer = styled.div`
  display: flex;
`

export const TopMarginDivSmall = styled.div`
  margin-top: 1rem;
`

export const TopMarginDivLarge = styled.div`
  margin-top: 2rem;
`

export const SpaciousPaper = styled(Paper)`
  padding: 1rem;
  margin: 0.5rem;
`
/**** WORK ON THIS ****/
export const SpaciousTypography = styled(Typography)`
  /*   padding-bottom: 0.75rem; */
  padding-bottom: 0.5rem !Important;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  line-height: normal;
  margin-top: 2rem;
`
export const HeadingTypography = styled(Typography)`
  /* padding-bottom: 0.5rem !Important; */
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
  line-height: normal;
  /* margin: 1rem 0; */
  display: flex;
  align-items: center;
`

export const BoldTypographyNormal = styled(BoldTypography)`
  font-size: 1rem;
`

export const BoldTypographyMedium = styled(BoldTypography)`
  font-size: 1.25rem;
`

export const BoldTypographyLarge = styled(BoldTypography)`
  font-size: 1.5rem;
`

export const SpaciousDiv = styled.div`
  padding-bottom: 0;
`

export const withMargin = (
  Component: React.ComponentType<any>,
  margin: string,
) => {
  return styled(Component)`
    && {
      margin: ${margin};
    }
  `
}

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

export const StyledButton = styled(BaseButton)`
  padding: 10px 20px;
  /*   border-radius: 15px; */
  border-radius: 45px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`
export const UpdatedStyledButton = styled(BaseButton)`
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: none;
`
export const SecondaryStyledButton = styled(BaseButton)`
  padding: 10px 20px;
  border-radius: 6px;
  box-shadow: none;
`

export const WhiteSpacePreservingTypography = styled(Typography)`
  white-space: pre-line;
`

interface ItemContentProps {
  providedStyles: string | undefined
}

export const ItemContent = styled.div<ItemContentProps>`
  ${({ providedStyles }) => providedStyles}
`
