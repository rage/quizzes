import { Button, CardActions, Grid } from "@material-ui/core"
import React from "react"

const BottomActionButtons = ({
  onSave,
  itemHasBeenSaved,
  handleExpand,
  handleCancel,
}) => (
  <Grid item={true}>
    <CardActions>
      <Button
        style={{
          backgroundColor: "#00FF19",
          color: "white",
          borderRadius: "5px",
        }}
        onClick={onSave}
      >
        {itemHasBeenSaved ? "Save" : "Add"}
      </Button>
      <Button
        style={{
          backgroundColor: "#FF1F00",
          color: "white",
          borderRadius: "5px",
        }}
        onClick={itemHasBeenSaved ? handleExpand : handleCancel}
      >
        Cancel
      </Button>
    </CardActions>
  </Grid>
)

export default BottomActionButtons
