import React from 'react'
import { RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, Grid } from "@material-ui/core"


// for now set here - might this differ for different scales, or always 7...?
const scale_options = 7



const Scale = ({ handleIntOptionChange, intData, title }) => (

    <div>
    <FormControl fullWidth component="fieldset">

    <Grid container >

    <Grid item xs={4}>
      <FormLabel component="legend">{title}</FormLabel>
    </Grid>

    <Grid item xs>
      <RadioGroup 
        row
        aria-label="agreement"
        name="agreement"
        value={`${intData}`}
        onChange={handleIntOptionChange}
      >

      {
          Array.from(
              {length: scale_options},
              (v, i) => i+1
          ).map(
              number => (
                  <FormControlLabel
                  key={number}
                  value={`${number}`}
                  control={<Radio color="primary" />} 
                  label={`${number}`}
                  labelPlacement="start"
                  />
              
          ))
      }


        </RadioGroup>
      </Grid>      
    </Grid>

    </FormControl>
    </div>
   )

export default Scale
