import { Button, Grid, IconButton, Typography } from "@material-ui/core"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import FirstPage from "@material-ui/icons/FirstPage"
import LastPage from "@material-ui/icons/LastPage"
import React from "react"

const PageSelector = ({ currentPage, totalPages, onPageChange }) => (
  <Grid
    container={true}
    spacing={0}
    justify="flex-start"
    style={{
      backgroundColor: "silver",
    }}
  >
    <PageButton icon={true} onClick={onPageChange(1)}>
      <FirstPage fontSize="small" />
    </PageButton>

    <PageButton icon={true} onClick={onPageChange(currentPage - 1)}>
      <ChevronLeft fontSize="small" />
    </PageButton>

    {currentPage > 2 && <Typography variant="body1">...</Typography>}

    {currentPage > 1 && (
      <PageButton onClick={onPageChange(currentPage - 1)}>
        {currentPage - 1}
      </PageButton>
    )}

    <PageButton current={true}>{currentPage}</PageButton>

    <PageButton onClick={onPageChange(currentPage + 1)}>
      {currentPage + 1}
    </PageButton>

    {totalPages - currentPage > 2 && (
      <Typography variant="body1">...</Typography>
    )}

    {totalPages - currentPage > 1 && (
      <PageButton onClick={onPageChange(totalPages)}>{totalPages}</PageButton>
    )}

    <PageButton icon={true} onClick={onPageChange(currentPage + 1)}>
      <ChevronRight fontSize="small" />
    </PageButton>

    <PageButton icon={true} onClick={onPageChange(totalPages)}>
      <LastPage fontSize="small" />
    </PageButton>
  </Grid>
)

const PageButton = props => {
  if (props.current) {
    return (
      <Button disabled={true} style={{ backgroundColor: "lightgray" }}>
        {props.children}
      </Button>
    )
  }

  return (
    <Grid item={true} xs="auto">
      {props.icon ? (
        <IconButton onClick={props.onClick}>{props.children}</IconButton>
      ) : (
        <Button onClick={props.onClick}>{props.children}</Button>
      )}
    </Grid>
  )
}

export default PageSelector
