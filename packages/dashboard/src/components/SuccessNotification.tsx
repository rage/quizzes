import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import React from "react"
import { connect } from "react-redux"
import { displayMessage } from "../store/notification/actions"

class SuccessNotification extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  public render() {
    if (this.props.notification === null) {
      return <React.Fragment />
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={this.props.notification !== null}
      >
        <SnackbarContent
          style={{
            backgroundColor: this.props.notification.isError ? "red" : "green",
          }}
          message={<span>{this.props.notification.message}</span>}
        />
      </Snackbar>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    notification: state.notification,
  }
}

const mapDispatchToProps = {
  displayMessage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SuccessNotification)
