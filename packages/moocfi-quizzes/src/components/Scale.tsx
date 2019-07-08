import * as React from "react"
import { useDispatch } from "react-redux"
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
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem } from "../modelTypes"

type ScaleProps = {
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

const Scale: React.FunctionComponent<ScaleProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleIntDataChange = (e: React.ChangeEvent<{}>, value: string) => {
    dispatch(quizAnswerActions.changeIntData(item.id, Number(value)))
  }

  const theme = useTheme()
  const matchesSmall = useMediaQuery(theme.breakpoints.down("sm"))

  const itemAnswers = useTypedSelector(
    state => state.quizAnswer.quizAnswer.itemAnswers,
  )
  const itemAnswer = itemAnswers.find(ia => ia.quizItemId === item.id)
  const intData = itemAnswer && itemAnswer.intData

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
            handleIntDataChange={handleIntDataChange}
            item={item}
            intData={typeof intData === "number" ? intData : undefined}
          />
        </Grid>
      </GridRow>
    </FormControl>
  )
}

type ScaleOptionsProps = {
  handleIntDataChange: (event: React.ChangeEvent<{}>, value: string) => void
  item: QuizItem
  intData: number | undefined
}

const ScaleOptions: React.FunctionComponent<ScaleOptionsProps> = ({
  handleIntDataChange,
  item,
  intData,
}) => {
  let number_of_options = 7
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const answered = answer.id ? true : false

  const minLabel = item.texts[0].minLabel
  const maxLabel = item.texts[0].maxLabel

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
            (v, i) => (item.minValue ? item.minValue : 1) + i,
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
