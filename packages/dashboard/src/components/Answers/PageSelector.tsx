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

    {currentPage > 3 && <Typography variant="body1">...</Typography>}

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
      <Typography variant="body1">...</Typography>
    )}

    {totalPages - currentPage > 1 && (
      <PageButton onClick={onPageChange(totalPages)}>{totalPages}</PageButton>
    )}

    {totalPages - currentPage > 0 && (
      <PageButton icon={true} onClick={onPageChange(currentPage + 1)}>
        <ChevronRight fontSize="small" />
      </PageButton>
    )}
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
    <Grid
      item={true}
      xs="auto"
      alignContent="stretch"
      alignItems="stretch"
      justify="center"
    >
      {props.icon ? (
        <IconButton onClick={props.onClick}>{props.children}</IconButton>
      ) : (
        <Button fullWidth={true} size="small" onClick={props.onClick}>
          {props.children}
        </Button>
      )}
    </Grid>
  )
}

export default PageSelector
