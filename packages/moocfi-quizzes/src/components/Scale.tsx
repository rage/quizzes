import * as React from "react"
import styled from "styled-components"
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

const NarrowTableCell = styled(TableCell)`
  width: 40%;
`

const StyledRadio = styled(Radio)`
  padding-left: 0;
`

const Scale: React.FunctionComponent<ScaleProps> = ({
  handleIntDataChange,
  intData,
  item,
}) => {
  let number_of_options = 7
  const answer = useTypedSelector(state => state.quizAnswer)
  const answered = answer.id ? true : false

  if (item.minValue && item.maxValue) {
    number_of_options = item.maxValue - item.minValue + 1
  }
  return (
    <div>
      <FormControl fullWidth={true}>
        <Table>
          <TableBody>
            <TableRow>
              <NarrowTableCell variant="body">
                <FormLabel>
                  <Typography variant="subtitle1">
                    {item.texts[0].title}
                  </Typography>
                </FormLabel>
              </NarrowTableCell>
              <NarrowTableCell variant="body" align="right">
                <RadioGroup
                  row={true}
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
                      control={
                        <StyledRadio color="primary" disabled={answered} />
                      }
                      label={`${number}`}
                      labelPlacement="start"
                    />
                  ))}
                </RadioGroup>
              </NarrowTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </FormControl>
    </div>
  )
}

export default Scale
