import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import React from "react"

const PageSelector = ({ currentPage, totalPages, onPageChange }) => (
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
    <PageButton icon={true} onClick={onPageChange(currentPage - 1)}>
      <ChevronLeft fontSize="small" />
    </PageButton>

    {currentPage > 2 && <PageButton onClick={onPageChange(1)}>1</PageButton>}

    {currentPage > 3 && (
      <Grid item={true} xs="auto">
        <Typography variant="body1">...</Typography>
      </Grid>
    )}

    {currentPage > 1 && (
      <PageButton onClick={onPageChange(currentPage - 1)}>
        {currentPage - 1}
      </PageButton>
    )}

    <PageButton current={true}>{currentPage}</PageButton>

    {totalPages - currentPage > 0 && (
      <PageButton onClick={onPageChange(currentPage + 1)}>
        {currentPage + 1}
      </PageButton>
    )}

    {totalPages - currentPage > 2 && (
      <Grid xs="auto" item={true}>
        <Typography variant="body1">...</Typography>
      </Grid>
    )}

    {totalPages - currentPage > 1 && (
      <PageButton onClick={onPageChange(totalPages)}>{totalPages}</PageButton>
    )}

    <PageButton icon={true} onClick={onPageChange(currentPage + 1)}>
      <ChevronRight fontSize="small" />
    </PageButton>
  </Grid>
)

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
