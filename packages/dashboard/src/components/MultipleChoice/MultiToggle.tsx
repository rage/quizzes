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
  </>
)

export default MultiToggle
