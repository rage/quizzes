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

export default class OptionDialog extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      correctChecked: false,
      optionData: {},
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Button onClick={this.handleClickOpen}>add option</Button>
        <Dialog
          fullWidth={true}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="option-dialog-title"
        >
          <DialogTitle id="option-dialog-title">
            Add new multiple choice option
          </DialogTitle>
          <DialogContent>
            <FormGroup>
              <Grid
                container={true}
                spacing={8}
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
              >
                <Grid item={true} xs={12} alignContent="stretch">
                  <TextField
                    autoFocus={true}
                    fullWidth={true}
                    multiline={true}
                    placeholder="Text"
                    value={this.state.optionData.title}
                    onChange={this.handleTextFieldChange("title")}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.correctChecked}
                        onChange={this.handleCheckingChange}
                        value="true"
                      />
                    }
                    label="Correct?"
                    labelPlacement="start"
                  />
                </Grid>

                <Grid item={true} xs={12}>
                  <TextField
                    fullWidth={true}
                    placeholder="failure message"
                    value={this.state.optionData.failureMessage}
                    onChange={this.handleTextFieldChange("failureMessage")}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    fullWidth={true}
                    placeholder="success message"
                    value={this.state.optionData.successMessage}
                    onChange={this.handleTextFieldChange("successMessage")}
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
      </React.Fragment>
    )
  }

  private handleTextFieldChange = fieldName => e => {
    const newOptionData = { ...this.state.optionData }
    newOptionData[fieldName] = e.target.value
    this.setState({ optionData: newOptionData })
  }

  private handleCheckingChange = () => {
    const newOptionData = { ...this.state.optionData }
    newOptionData.correct = !this.state.correctChecked

    this.setState({
      correctChecked: !this.state.correctChecked,
      optionData: newOptionData,
    })
  }

  private handleClickOpen = () => {
    this.setState({ open: true })
  }

  private handleSubmit = event => {
    this.props.onSubmit(this.state.optionData)(event)
    this.handleClose()
  }

  private handleClose = () => {
    this.setState({ open: false })
  }
}
