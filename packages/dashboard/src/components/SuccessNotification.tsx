import Grid from "@material-ui/core/Grid"
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import SvgIcon from "@material-ui/core/SvgIcon"
import Typography from "@material-ui/core/Typography"
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
          message={
            <Grid
              container={true}
              spacing={3}
              alignItems="center"
              justify="space-evenly"
            >
              <Grid item={true}>
                {this.props.notification.isError ? (
                  <this.FailureIcon />
                ) : (
                  <this.SuccessIcon />
                )}
              </Grid>
              <Grid item={true}>
                <Typography variant="body1" style={{ color: "white" }}>
                  {this.props.notification.message}
                </Typography>
              </Grid>
            </Grid>
          }
        />
      </Snackbar>
    )
  }

  private SuccessIcon = () => (
    <SvgIcon>
      <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
    </SvgIcon>
  )

  private FailureIcon = () => (
    <SvgIcon>
      <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
    </SvgIcon>
  )
}

const mapStateToProps = (state: any) => {
  return {
    notification: state.notification,
  }
}

const mapDispatchToProps = {
  displayMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(SuccessNotification)
