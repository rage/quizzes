import React from "react"

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"

interface IOptionDialogProps {
  onSubmit: (optionData: IOptionData) => (e: any) => void
  isOpen: boolean
  onClose: () => void
  existingOptData: null | IOptionData
}

interface IOptionDialogState {
  correctChecked: boolean
  inInitialState: boolean
  optionData: IOptionData
}

interface IOptionData {
  title?: string
  correct?: boolean
  message?: string
  // success/failure used to update the quiz when changes saved
  successMessage?: string
  failureMessage?: string
  order?: number
}

export default class OptionDialog extends React.Component<
  IOptionDialogProps,
  IOptionDialogState
> {
  constructor(props) {
    super(props)

    this.state = {
      correctChecked: false,
      optionData: {
        title: "",
        message: "",
        correct: false,
      },
      inInitialState: true,
    }
  }

  public componentDidUpdate() {
    if (this.props.existingOptData && this.state.inInitialState) {
      const newState = {
        correctChecked: false,
        optionData: {},
        inInitialState: false,
      }
      newState.correctChecked = !!this.props.existingOptData.correct
      newState.optionData = {
        ...this.props.existingOptData,
        message: this.props.existingOptData.correct
          ? this.props.existingOptData.successMessage
          : this.props.existingOptData.failureMessage,
      }

      this.setState({
        ...newState,
      })
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

    if (this.state.optionData.message !== nextState.optionData.message) {
      return true
    }

    if (
      JSON.stringify(this.props.existingOptData) !==
      JSON.stringify(nextProps.existingOptData)
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
              <Grid
                item={true}
                xs={12}
                sm={2}
                md={1}
                style={{ paddingRight: "5px" }}
              >
                <Typography variant="subtitle1">Text</Typography>
              </Grid>
              <Grid item={true} xs={12} sm={10} md={11}>
                <TextField
                  variant="outlined"
                  fullWidth={true}
                  multiline={true}
                  placeholder="Text"
                  value={this.state.optionData.title}
                  onChange={this.handleTextFieldChange("title")}
                />
              </Grid>
              <Grid
                item={true}
                xs={12}
                sm={2}
                md={1}
                style={{ paddingRight: "5px" }}
              >
                <Typography variant="subtitle1">Correct?</Typography>
              </Grid>
              <Grid item={true} xs={12} sm={10} md={11}>
                <Checkbox
                  color="primary"
                  checked={this.state.correctChecked}
                  onChange={this.handleCheckingChange}
                  value="true"
                  style={{ paddingLeft: "0" }}
                />
              </Grid>

              <Grid item={true} xs={12} sm={3} lg={4}>
                <Typography variant="subtitle1" style={{ paddingRight: "5px" }}>
                  Explanation why this option is{" "}
                  {!this.state.optionData.correct && "in"}correct
                </Typography>
              </Grid>
              <Grid item={true} xs={12} sm={9} lg={8}>
                <TextField
                  variant="outlined"
                  fullWidth={true}
                  placeholder="feedback message"
                  multiline={true}
                  value={this.state.optionData.message}
                  onChange={this.handleTextFieldChange("message")}
                />
                <Typography variant="body1" style={{ padding: "5px 0" }}>
                  The student won't see this before completing the exercise.
                </Typography>
              </Grid>
            </Grid>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            style={{ backgroundColor: "rgb(220, 25, 0)", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            style={{ backgroundColor: "rgb(15, 125, 0)", color: "white" }}
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
    this.setState({ optionData: newOptionData, inInitialState: false })
  }

  private handleCheckingChange = () => {
    const newOptionData = { ...this.state.optionData }
    newOptionData.correct = this.state.correctChecked ? false : true

    this.setState({
      correctChecked: !this.state.correctChecked,
      optionData: newOptionData,
      inInitialState: false,
    })
  }

  private handleSubmit = event => {
    const data = this.state.optionData
    if (data.correct) {
      data.successMessage = data.message
    } else {
      data.failureMessage = data.message
    }
    this.props.onSubmit(this.state.optionData)(event)

    this.handleClose()
  }

  private handleClose = () => {
    this.props.onClose()
    this.setState({
      optionData: {},
      correctChecked: false,
      inInitialState: true,
    })
  }
}
