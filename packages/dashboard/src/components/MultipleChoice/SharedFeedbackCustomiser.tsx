import { Checkbox, FormControlLabel, Grow, TextField } from "@material-ui/core"
import * as React from "react"

interface ISharedFeedbackCustomiserProps {
  sharedMessageIsUsed: boolean
  sharedFeedbackMessage: string
  handleToggleChange: (e: any) => void
  handleMessageChange: (e: any) => void
}

const SharedFeedbackCustomiser: React.FunctionComponent<
  ISharedFeedbackCustomiserProps
> = ({
  sharedMessageIsUsed,
  sharedFeedbackMessage,
  handleMessageChange,
  handleToggleChange,
}) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={sharedMessageIsUsed}
            color="primary"
            onChange={handleToggleChange}
          />
        }
        label="Set a shared feedback message for all options"
      />

      <Grow
        // style={{ transformOrigin: "right center" }}
        style={{ width: "100%" }}
        in={sharedMessageIsUsed}
        // btimeout={deadlineChecked && shouldAnimateTextField ? 500 : 0}
      >
        <TextField
          variant="outlined"
          value={sharedFeedbackMessage}
          onChange={handleMessageChange}
          multiline={true}
          type="text"
        />
      </Grow>
    </>
  )
}

export default SharedFeedbackCustomiser
