import * as React from "react"
import styled from "styled-components"
import {
  Button,
  IconButton,
  Snackbar,
  SnackbarContent,
  Typography,
} from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWindowClose } from "@fortawesome/free-solid-svg-icons"
// import * as faWindowClose from "@fortawesome/free-regular-svg-icons/faWindowClose"

const StyledSnackbarContent = styled(SnackbarContent)`
  background-color: #213094;
  color: white;
`

interface ISubmitSnackBarProps {
  submitClicked: boolean
}

const SubmitSnackBar: React.FunctionComponent<ISubmitSnackBarProps> = ({
  submitClicked,
}) => {
  const [shown, setShown] = React.useState(false)

  if (submitClicked && !shown) {
    setShown(true)
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      open={shown}
      autoHideDuration={5000}
      onClose={() => setShown(false)}
    >
      <StyledSnackbarContent
        action={
          <IconButton onClick={() => setShown(false)}>
            <FontAwesomeIcon color="white" icon={faWindowClose} />
          </IconButton>
        }
        message={
          <Typography variant="body1">successfully submitted</Typography>
        }
      />
    </Snackbar>
  )
}

export default SubmitSnackBar
