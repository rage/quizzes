import { Grid, IconButton } from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import DragHandleWrapper from "../DragHandleWrapper"

const ShortItemWrapper = (props) => (
  <Grid
    container={true}
    spacing={3}
    justify="center"
    alignItems="center"
    style={{ marginTop: "2em", marginBottom: "2em" }}
  >
    <DragHandleWrapper>
      <Grid item={true} xs={12} sm={10} lg={8}>
        {props.children}
      </Grid>
      <Grid item={true} xs={1}>
        <IconButton
          aria-label="Modify item"
          color="primary"
          disableRipple={true}
          onClick={props.toggleExpand}
        >
          <Create component="svg" fontSize="large" htmlColor="#B5B5B5" />
        </IconButton>
      </Grid>
    </DragHandleWrapper>
  </Grid>
)

export default ShortItemWrapper
