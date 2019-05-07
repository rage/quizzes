import { Grid, IconButton, TextField, Typography } from "@material-ui/core"
import Create from "@material-ui/icons/Create"
import React from "react"
import DragHandleWrapper from "../DragHandleWrapper"

const ShortEssay = props => {
  const item = props.items[props.order]

  return (
    <Grid
      container={true}
      spacing={16}
      justify="center"
      alignItems="center"
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <DragHandleWrapper>
        <Grid item={true} xs={12} sm={10} lg={8}>
          <Grid
            container={true}
            spacing={16}
            justify="flex-start"
            alignItems="center"
          >
            <Grid item={true} xs={12}>
              <Typography variant="title">{`${item.texts[0].title ||
                "Question " + (props.order + 1)} (Essay)`}</Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                variant="outlined"
                disabled={true}
                fullWidth={true}
                multiline={true}
                rowsMax={4}
                value={item.texts[0].body || ""}
                onClick={props.toggleExpand}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={1}>
          <IconButton
            aria-label="Modify essay"
            color="primary"
            disableRipple={true}
            onClick={props.toggleExpand}
          >
            <Create fontSize="large" nativeColor="#B5B5B5" />
          </IconButton>
        </Grid>
      </DragHandleWrapper>
    </Grid>
  )
}

export default ShortEssay
