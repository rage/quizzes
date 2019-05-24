import React from "react"
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core"

const Scale = ({ handleIntDataChange, intData, item, answered }) => {
  let number_of_options = 7

  if (item.minWords && item.maxWords) {
    number_of_options = item.maxWords - item.minWords + 1
  }
  return (
    <div>
      <FormControl fullWidth component="fieldset">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "40%" }}>
                <FormLabel component="legend">
                  <Typography variant="subtitle1">
                    {item.texts[0].title}
                  </Typography>
                </FormLabel>
              </TableCell>
              <TableCell style={{ width: "40%" }}>
                <RadioGroup
                  row
                  aria-label="agreement"
                  name="agreement"
                  value={`${intData}`}
                  onChange={handleIntDataChange}
                >
                  {Array.from(
                    { length: number_of_options },
                    (v, i) => (item.minWords ? item.minWords : 1) + i,
                  ).map(number => (
                    <FormControlLabel
                      key={number}
                      value={`${number}`}
                      control={<Radio {...radioButtonOptions(answered)} />}
                      label={`${number}`}
                      labelPlacement="start"
                    />
                  ))}
                </RadioGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </FormControl>
    </div>
  )
}

const radioButtonOptions = answered => {
  let options = {
    style: {
      paddingLeft: 0,
    },
    color: "primary",
  }

  if (answered) {
    options.disabled = true
  }
  return options
}

export default Scale
