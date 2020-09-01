import styled from "styled-components"
import { TextField, Typography } from "@material-ui/core"
import { Pagination, Skeleton } from "@material-ui/lab"

export const SizeSelectorContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
  justify-content: flex-end;
`

export const SizeSelectorField = styled(TextField)`
  display: flex !important;
`

export const PaginationField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 1rem;
`

export const Paginator = styled(Pagination)`
  display: flex !important;
`

export const SwitchField = styled.div`
  display: flex;
  align-items: baseline;
`

export const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

export const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
export const SortOrderField = styled(TextField)`
  display: flex !important;
  width: 33%;
`

export const FilterParamsField = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  margin-bottom: 2rem;
`

export const StyledTitle = styled(Typography)`
  display: flex !important;
  width: 100% !important;
`
