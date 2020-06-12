import { Grid, TextField, Typography } from "@material-ui/core"
import React from "react"
import ShortWrapper from "../ItemTools/ShortWrapper"

const ShortOpen = (props) => {
  const item = props.items[props.order]

  return (
    <ShortWrapper toggleExpand={props.toggleExpand}>
      <Grid
        container={true}
        spacing={3}
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true} xs={6} xl={4}>
          <Typography variant="h6">
            {item.texts[0].title} ({item.type})
          </Typography>
        </Grid>
        <Grid item={true} xs={6} xl={8}>
          <TextField
            disabled={true}
            fullWidth={true}
            value={item.validityRegex}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </ShortWrapper>
  )
}

export default ShortOpen
