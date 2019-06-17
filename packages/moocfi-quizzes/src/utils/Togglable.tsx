import React, { Component } from "react"
import Button from "@material-ui/core/Button"

interface TogglebleState {
  toggled: boolean
}

export interface TogglableProps {
  initiallyVisible: boolean
  hideButtonText: string
  displayButtonText: string
}

class Togglable extends Component<TogglableProps, TogglebleState> {
  constructor(props) {
    super(props)
    this.state = { toggled: props.initiallyVisible }
  }

  toggle = () => {
    this.setState({ toggled: !this.state.toggled })
  }

  render = () => {
    return (
      <React.Fragment>
        <Button variant="outlined" color="default" onClick={this.toggle}>
          {this.state.toggled
            ? this.props.hideButtonText
            : this.props.displayButtonText}
        </Button>
        {this.state.toggled && this.props.children}
      </React.Fragment>
    )
  }
}

export default Togglable
