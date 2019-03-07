import React from 'react'
import { FormControl, FormLabel, FormControlLabel,
  Radio, RadioGroup,
  Table, TableBody, TableCell, TableRow,
  Typography } from "@material-ui/core"


const NUMBER_OF_OPTIONS = 7



const Scale = ({ handleIntDataChange,
   intData,
    item,
  answered }) => {

    
    return (
    <div>
    <FormControl fullWidth component="fieldset">

    <Table>
      <TableBody>
      <TableRow>

    <TableCell style={{width: "40%"}}>
      <FormLabel component="legend" ><Typography variant="subtitle1">{item.texts[0].title}</Typography></FormLabel>
    </TableCell>

    <TableCell style={{width: "40%"}}>
      <RadioGroup 
        row
        aria-label="agreement"
        name="agreement"
        value={`${intData}`}
        onChange={handleIntDataChange}
      >

      {
          Array.from(
              {length: NUMBER_OF_OPTIONS},
              (v, i) => i+1
          ).map(
              number => (
                  <FormControlLabel
                  key={number}
                  value={`${number}`}
                  control={
                    <Radio {...radioButtonOptions(answered)} />
                  } 
                  label={`${number}`}
                  labelPlacement="start"
                  />
              
          ))
      }
        </RadioGroup>
      </TableCell>   
      </TableRow>   
      </TableBody>
    </Table>

    </FormControl>
    </div>
   )
  }

  const radioButtonOptions = (answered) => {
    let options = {
      style: {
        paddingLeft: 0,
      }, 
      color: answered ? "default" : "primary"
    }

    if(answered){
      options.onChange=null
    }
    return options
  }

export default Scale
