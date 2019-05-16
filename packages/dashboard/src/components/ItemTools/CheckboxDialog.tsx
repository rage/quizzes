import React from "react"

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"

export default class CheckboxDialog extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      title: props.title,
      body: props.body,
    }
  }

  public render() {
    return (
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={this.props.isOpen}
        onClose={this.handleClose}
        aria-labelledby="option-dialog-title"
      >
        <DialogTitle id="option-dialog-title">
          {this.props.existingOptData ? "Modify checkbox" : "Add new checkbox"}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <Grid
              container={true}
              spacing={0}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} xs={1}>
                Title
              </Grid>
              <Grid item={true} xs={11}>
                <TextField
                  fullWidth={true}
                  multiline={true}
                  placeholder="Text"
                  value={this.state.title}
                  onChange={this.handleTextFieldChange("title")}
                />
              </Grid>
              <Grid item={true} xs={1}>
                Body
              </Grid>
              <Grid item={true} xs={11}>
                <TextField
                  fullWidth={true}
                  multiline={true}
                  placeholder="Body"
                  value={this.state.body}
                  onChange={this.handleTextFieldChange("body")}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            style={{ backgroundColor: "#FF1F00" }}
          >
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            style={{ backgroundColor: "#00FF19" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  private handleTextFieldChange = fieldName => e => {
    if (fieldName === "title") {
      this.setState({ title: e.target.value })
    } else {
      this.setState({ body: e.target.value })
    }
  }

  private handleSubmit = event => {
    this.props.onSubmit(this.state.optionData)(event)
    this.handleClose()
  }

  private handleClose = () => {
    this.props.onClose()
    this.setState({ title: null, body: null })
  }
}
