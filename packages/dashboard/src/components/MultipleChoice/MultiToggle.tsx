import { Checkbox, FormControlLabel, Grow, TextField } from "@material-ui/core"
import React from "react"

interface IMultiToggleProps {
  multi: boolean
  toggleMulti: (e: any) => void
}

const MultiToggle: React.FunctionComponent<IMultiToggleProps> = ({
  multi,
  toggleMulti,
}) => (
  <>
    <FormControlLabel
      control={
        <Checkbox checked={multi} color="primary" onChange={toggleMulti} />
      }
      label="Answerer should choose all the correct options"
    />

    <Grow
      style={{
        display: multi ? "inline-flex" : "none",
        width: "100%",
        marginTop: "1rem",
      }}
      in={multi}
    >
      <TextField
        variant="outlined"
        placeholder="Grading policy (this does nothing at the moment you can write anything)"
        multiline={true}
        type="text"
      />
    </Grow>
  </>
)

export default MultiToggle
