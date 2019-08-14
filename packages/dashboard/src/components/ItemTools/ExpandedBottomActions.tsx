import { Button, CardActions, Grid, IconButton } from "@material-ui/core"
import Delete from "@material-ui/icons/Delete"
import React from "react"
import { connect } from "react-redux"
import { remove } from "../../store/edit/actions"

class BottomActionButtons extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <Grid item={true}>
        <CardActions>
          {this.props.itemHasBeenSaved && (
            <IconButton onClick={this.handleRemoval(this.props.index)}>
              <Delete fontSize="large" />
            </IconButton>
          )}
          <Button
            style={{
              backgroundColor: "rgb(220, 25, 0)",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={
              this.props.itemHasBeenSaved
                ? this.props.handleExpand
                : this.props.handleCancel
            }
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "rgb(15, 125, 0)",
              color: "white",
              borderRadius: "5px",
            }}
            onClick={this.props.onSave}
          >
            {this.props.itemHasBeenSaved ? "Save" : "Add"}
          </Button>
        </CardActions>
      </Grid>
    )
  }

  public handleRemoval = (idx: number) => () => {
    this.props.remove("items", idx)
  }
}

export default connect(
  null,
  { remove },
)(BottomActionButtons)
