import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import React from "react"

const PageSelector = ({
  isAtBottom = false,
  changeResultsPerPage,
  currentPage,
  onPageChange,
  resultsPerPage,
  totalPages,
}) => {
  const handlePageChange = isAtBottom
    ? (n: number) => () => {
        scrollTo({ left: 0, top: 0, behavior: "auto" })
        onPageChange(n)()
      }
    : onPageChange

  const handleResultsPerPageChange = isAtBottom
    ? async (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeResultsPerPage(e, true)
      }
    : changeResultsPerPage

  return (
    <Grid container={true} justify="space-between">
      <Grid item={true} xs="auto">
        <Grid
          container={true}
          spacing={0}
          justify="flex-start"
          alignContent="center"
          alignItems="center"
          style={{
            backgroundColor: "silver",
          }}
        >
          <PageButton icon={true} onClick={handlePageChange(currentPage - 1)}>
            <ChevronLeft fontSize="small" />
          </PageButton>

          {currentPage > 2 && (
            <PageButton onClick={handlePageChange(1)}>1</PageButton>
          )}

          {currentPage > 3 && (
            <Grid item={true} xs="auto">
              <Typography variant="body1">...</Typography>
            </Grid>
          )}

          {currentPage > 1 && (
            <PageButton onClick={handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </PageButton>
          )}

          <PageButton current={true}>{currentPage}</PageButton>

          {totalPages - currentPage > 0 && (
            <PageButton onClick={handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </PageButton>
          )}

          {totalPages - currentPage > 2 && (
            <Grid xs="auto" item={true}>
              <Typography variant="body1">...</Typography>
            </Grid>
          )}

          {totalPages - currentPage > 1 && (
            <PageButton onClick={handlePageChange(totalPages)}>
              {totalPages}
            </PageButton>
          )}

          <PageButton icon={true} onClick={handlePageChange(currentPage + 1)}>
            <ChevronRight fontSize="small" />
          </PageButton>
        </Grid>
      </Grid>

      <Grid item={true} xs="auto">
        <FormControl>
          <FormControlLabel
            label="Answers per page"
            labelPlacement="bottom"
            control={
              <Select
                value={resultsPerPage}
                onChange={handleResultsPerPageChange}
                name="resultsPerPage"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            }
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

const PageButton = props => {
  if (props.current) {
    return (
      <Button
        size="small"
        disabled={true}
        style={{ backgroundColor: "lightgray" }}
      >
        {props.children}
      </Button>
    )
  }

  return (
    <Grid item={true} xs="auto">
      {props.icon ? (
        <IconButton onClick={props.onClick}>{props.children}</IconButton>
      ) : (
        <Button size="small" onClick={props.onClick}>
          {props.children}
        </Button>
      )}
    </Grid>
  )
}

export default PageSelector
