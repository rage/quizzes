import { Grid, Typography } from "@material-ui/core"
import React from "react"

const FilterBox = ({ numberOfAnswers }) => {
  console.log("Number of answers: ", numberOfAnswers)
  return (
    <React.Fragment>
      <Grid
        item={true}
        xs={12}
        style={{ marginBottom: "1.5em", textAlign: "center" }}
      >
        <Typography variant="title">FILTER OPTIONS</Typography>
      </Grid>

      <Grid container={true} spacing={32} style={{ backgroundColor: "gray" }}>
        <Grid item={true} xs={12}>
          <Typography variant="subtitle1">
            Total number of answers: {numberOfAnswers}
          </Typography>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="subtitle1">Filter options: to do</Typography>
        </Grid>

        <Grid item={true} xs={12}>
          <Typography variant="subtitle1">Order options: to do</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default FilterBox
