import React, { Component } from "react"
import Button from "@material-ui/core/Button"

class Togglable extends Component {
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
