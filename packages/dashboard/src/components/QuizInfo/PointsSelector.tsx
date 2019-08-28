import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core"
import React from "react"

export const PointsPolicySelector = ({
  grantPointsPolicy,
  handlePolicyChange,
}) => {
  return (
    <FormControl>
      <InputLabel style={{ minWidth: "250px" }}>
        Point granting policy
      </InputLabel>
      <Select
        value={grantPointsPolicy}
        onChange={handlePolicyChange}
        variant="outlined"
      >
        <MenuItem value="grant_whenever_possible">
          For every item that is correct
        </MenuItem>
        <MenuItem value="grant_only_when_answer_fully_correct">
          Only when the whole answer is correct
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export const NumberOfPointsSelector = ({ points, handlePointsChange }) => {
  return (
    <TextField
      label="Points"
      value={points}
      onChange={handlePointsChange}
      type="number"
      style={{ maxWidth: "75px" }}
    />
  )
}
