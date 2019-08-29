import {
  Checkbox,
  FormControlLabel,
  Grid,
  Grow,
  TextField,
} from "@material-ui/core"
import React from "react"

interface ITriesCustomiserProps {
  triesLimited: boolean
  tries: number
  toggleTriesLimited: (e: any) => void
  handleTriesChange: (e: any) => void
  shouldAnimateTextField: boolean
}

const TriesCustomiser: React.FunctionComponent<ITriesCustomiserProps> = ({
  triesLimited,
  toggleTriesLimited,
  tries,
  handleTriesChange,
  shouldAnimateTextField,
}) => {
  return (
    <Grid container={true} justify="flex-start">
      <Grid item={true} xs="auto">
        <FormControlLabel
          control={
            <Checkbox
              checked={triesLimited}
              color="primary"
              onChange={toggleTriesLimited}
            />
          }
          label="Number of tries is limited"
        />
      </Grid>

      <Grow
        style={{ transformOrigin: "left center" }}
        in={triesLimited}
        timeout={triesLimited && shouldAnimateTextField ? 500 : 0}
      >
        <TextField
          label="Tries"
          value={tries}
          onChange={handleTriesChange}
          type="number"
          style={{ maxWidth: "75px" }}
        />
      </Grow>
    </Grid>
  )
}

export default TriesCustomiser
