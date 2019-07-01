import * as React from "react"
import styled from "styled-components"
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"

type ScaleProps = {
  handleIntDataChange: (event: React.FormEvent, value: string) => void
  intData: number
  item: QuizItem
}

const GridRow = styled(Grid)`
  border-bottom: 1px solid gray;
`

const SmallCenteredGrid = styled(({ matchesSmall, ...others }) => (
  <Grid {...others} />
))`
  text-align: ${({ matchesSmall }) => (matchesSmall ? "center" : "inherit")};
  padding-bottom: ${({ matchesSmall }) => (matchesSmall ? ".5rem" : "0")};
`

const StyledRadio = styled(Radio)`
  padding-left: 0;
`

const Scale: React.FunctionComponent<ScaleProps> = ({
  handleIntDataChange,
  intData,
  item,
}) => {
  const theme = useTheme()
  const matchesSmall = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <FormControl fullWidth={true} style={{ marginBottom: "1rem" }}>
      <GridRow container={true} justify="flex-start" alignItems="center">
        <SmallCenteredGrid
          matchesSmall={matchesSmall}
          item={true}
          xs={12}
          md={6}
        >
          <FormLabel>
            <Typography variant="subtitle1">{item.texts[0].title}</Typography>
          </FormLabel>
        </SmallCenteredGrid>
        <Grid item={true} xs={12} md={6}>
          <ScaleOptions
            intData={intData}
            handleIntDataChange={handleIntDataChange}
            item={item}
          />
        </Grid>
      </GridRow>
    </FormControl>
  )
}

const ScaleOptions: React.FunctionComponent<ScaleProps> = ({
  intData,
  handleIntDataChange,
  item,
}) => {
  let number_of_options = 7
  const answer = useTypedSelector(state => state.quizAnswer)
  const answered = answer.id ? true : false

  const minLabel = item.texts[0].successMessage
  const maxLabel = item.texts[0].failureMessage

  if (item.minValue && item.maxValue) {
    number_of_options = item.maxValue - item.minValue + 1
  }

  return (
    <Grid container={true} direction="column" alignContent="center">
      {(minLabel || maxLabel) && (
        <Grid item={true} xs={12}>
          <Grid container={true} justify="space-between">
            <Grid item={true}>{minLabel || ""}</Grid>
            <Grid item={true}>{maxLabel || ""}</Grid>
          </Grid>
        </Grid>
      )}

      <Grid item={true}>
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
              control={<StyledRadio color="primary" disabled={answered} />}
              label={`${number}`}
              labelPlacement="start"
            />
          ))}
        </RadioGroup>
      </Grid>
    </Grid>
  )
}

export default Scale
