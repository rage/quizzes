import { Grid, Typography } from "@material-ui/core"
import Reorder from "@material-ui/icons/Reorder"
import React from "react"
import DragHandleWrapper from "./DragHandleWrapper"

const TopInformation = ({ type }) => (
  <React.Fragment>
    <Grid item={true} xs={11}>
      <Typography color="textSecondary" gutterBottom={true}>
        Type: {type.charAt(0).toUpperCase() + type.substring(1, type.length)}
      </Typography>
    </Grid>

    <Grid item={true} xs={1}>
      <DragHandleWrapper>
        <Reorder
          fontSize="large"
          style={{
            transform: "scale(3,1.5)",
            cursor: "pointer",
          }}
        />
      </DragHandleWrapper>
    </Grid>
  </React.Fragment>
)

export default TopInformation
