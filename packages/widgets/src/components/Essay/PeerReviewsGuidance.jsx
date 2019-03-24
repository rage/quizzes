import React from "react"
import Typography from "@material-ui/core/Typography"

export default ({ guidanceText, givenLabel, given, required }) => (
  <div>
    <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
      {guidanceText}
    </Typography>
    <Typography variant="subtitle1" style={{ paddingTop: 10 }}>
      {givenLabel}: {given}/{required}
    </Typography>
    <Typography variant="subtitle1">
      {given >= required && "Olet antanut tarvittavat vertaisarviot"}
    </Typography>
  </div>
)
