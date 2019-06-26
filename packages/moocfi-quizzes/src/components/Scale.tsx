import * as React from "react"
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
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"

type ScaleProps = {
  handleIntDataChange: (event: React.FormEvent, value: string) => void
  intData: number
  item: QuizItem
}

type Radio = {
  style: { paddingLeft: number }
  color: "primary" | "secondary" | "default"
  disabled: boolean
}

const Scale: React.FunctionComponent<ScaleProps> = ({
  handleIntDataChange,
  intData,
  item,
}) => {
  let number_of_options = 7
  const answer = useTypedSelector(state => state.quiz)
  const answered = answer.id ? true : false

  if (item.minValue && item.maxValue) {
    number_of_options = item.maxValue - item.minValue + 1
  }
  return (
    <div>
      <FormControl fullWidth>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: "40%" }}>
                <FormLabel>
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

const radioButtonOptions = (answered: boolean) => {
  const options: Radio = {
    style: {
      paddingLeft: 0,
    },
    color: "primary",
    disabled: answered,
  }
  return options
}

export default Scale
