import { Checkbox, FormControlLabel, Grow, TextField } from "@material-ui/core"
import * as React from "react"

interface ISharedFeedbackCustomiserProps {
  sharedMessageIsUsed: boolean
  sharedFeedbackMessage?: string
  handleToggleChange: (e: any) => void
  handleMessageChange: (e: any) => void
}

const SharedFeedbackCustomiser: React.FunctionComponent<ISharedFeedbackCustomiserProps> = ({
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
        label="Set a shared feedback message for all options. Overrides feedback message of every option."
      />

      <Grow
        style={{
          display: sharedMessageIsUsed ? "inline-flex" : "none",
          width: "100%",
          marginTop: "1rem",
        }}
        in={sharedMessageIsUsed}
      >
        <TextField
          variant="outlined"
          value={sharedFeedbackMessage || ""}
          onChange={handleMessageChange}
          multiline={true}
          type="text"
        />
      </Grow>
    </>
  )
}

export default SharedFeedbackCustomiser
