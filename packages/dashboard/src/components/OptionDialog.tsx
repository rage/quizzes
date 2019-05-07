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
      correctChecked: false,
      optionData: {
        correct: false,
      },
    }
  }

  public componentDidUpdate() {
    if (
      this.props.existingOptData &&
      JSON.stringify(this.state.optionData) === "{}"
    ) {
      const initial = { correctChecked: false, optionData: {} }
      initial.correctChecked = this.props.existingOptData.correct
      initial.optionData = {
        ...this.props.existingOptData,
      }
      this.setState(initial)
    }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    if (this.props.isOpen !== nextProps.isOpen) {
      return true
    }
    if (this.state.correctChecked !== nextState.correctChecked) {
      return true
    }

    if (this.state.optionData.title !== nextState.optionData.title) {
      return true
    }

    if (
      this.state.optionData.successMessage !==
      nextState.optionData.successMessage
    ) {
      return true
    }

    if (
      this.state.optionData.failureMessage !==
      nextState.optionData.failureMessage
    ) {
      return true
    }

    return false
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
          {this.props.existingOptData
            ? "Modify option"
            : "Add new multiple choice option"}
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
                Text
              </Grid>
              <Grid item={true} xs={11}>
                <TextField
                  fullWidth={true}
                  multiline={true}
                  placeholder="Text"
                  value={this.state.optionData.title}
                  onChange={this.handleTextFieldChange("title")}
                />
              </Grid>
              <Grid item={true} xs={1}>
                Correct?
              </Grid>
              <Grid item={true} xs={11}>
                <Checkbox
                  color="primary"
                  checked={this.state.correctChecked}
                  onChange={this.handleCheckingChange}
                  value="true"
                />
              </Grid>

              <Grid item={true} xs={2}>
                failure message
              </Grid>
              <Grid item={true} xs={10}>
                <TextField
                  fullWidth={true}
                  placeholder="failure message"
                  multiline={true}
                  value={this.state.optionData.failureMessage}
                  onChange={this.handleTextFieldChange("failureMessage")}
                />
              </Grid>
              <Grid item={true} xs={2}>
                success message
              </Grid>
              <Grid item={true} xs={10}>
                <TextField
                  fullWidth={true}
                  placeholder="success message"
                  multiline={true}
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
    )
  }

  private handleTextFieldChange = fieldName => e => {
    const newOptionData = { ...this.state.optionData }
    newOptionData[fieldName] = e.target.value
    this.setState({ optionData: newOptionData })
  }

  private handleCheckingChange = () => {
    const newOptionData = { ...this.state.optionData }
    newOptionData.correct = this.state.correctChecked ? false : true

    this.setState({
      correctChecked: !this.state.correctChecked,
      optionData: newOptionData,
    })
  }

  private handleSubmit = event => {
    console.log("option data: ", this.state.optionData)
    this.props.onSubmit(this.state.optionData)(event)
    this.handleClose()
  }

  private handleClose = () => {
    this.props.onClose()
    this.setState({ optionData: {}, correctChecked: false })
  }
}
