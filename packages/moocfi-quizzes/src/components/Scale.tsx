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
import LaterQuizItemAddition from "./LaterQuizItemAddition"

type ScaleProps = {
  item: QuizItem
}

interface IGridRowProps {
  backgroundIsGray: boolean
}

const GridRow = styled(Grid)<IGridRowProps>`
  background-color: ${({ backgroundIsGray }) =>
    backgroundIsGray ? "#605c980d" : "inherit"};
  padding: 1rem 2rem 1rem 1rem;
  border-radius: 10px;
`

const SmallCenteredGrid = styled(({ matchesSmall, ...others }) => (
  <Grid {...others} />
))`
  text-align: ${({ matchesSmall }) => (matchesSmall ? "center" : "inherit")};
  padding-bottom: ${({ matchesSmall }) => (matchesSmall ? ".5rem" : "0")};
`

const WideGridItem = styled(({ ...params }) => (
  <Grid item={true} xs={12} {...params} />
))`
  width: 100%;
`

interface IStyledRadioProps {
  palette: any
}

const StyledRadio = styled(Radio)<IStyledRadioProps>`
  padding-left: 0.25rem;

  &.MuiRadio-root {
    color: ${({ palette }) => palette.text.secondary};
  }

  &.MuiRadio-colorPrimary.Mui-checked {
    color: ${({ palette }) => palette.primary.main};
  }

  &.MuiRadio-colorPrimary.Mui-disabled {
    color: ${({ palette }) => palette.action.disabled};
  }
`

const StyledFormLabel = styled(FormLabel)`
  && {
    color: black;
  }
`
const StyledOptionItem = styled(({ numberOfOptions, ...other }) => (
  <Grid item={true} zeroMinWidth={true} {...other} />
))`
  maxwidth: ${({ numberOfOptions }) =>
    numberOfOptions <= 12 ? `${100 / numberOfOptions}%` : "100%"};
`

const Scale: React.FunctionComponent<ScaleProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleIntDataChange = (e: React.ChangeEvent<{}>, value: string) => {
    dispatch(quizAnswerActions.changeIntData(item.id, Number(value)))
  }

  const backgroundShouldBeColored = (
    items: QuizItem[],
    itemId: string,
  ): boolean => {
    const scaleAndColored = items.map(qi => true)

    for (let i = 0; i < items.length; i++) {
      let qi = items[i]
      if (i === 0) {
        scaleAndColored[i] = false
      } else if (items[i - 1].type !== "scale") {
        scaleAndColored[i] = false
      } else {
        scaleAndColored[i] = !scaleAndColored[i - 1]
      }

      if (qi.id === itemId) {
        return scaleAndColored[i]
      }
    }

    return false
  }

  const theme = useTheme()
  const matchesSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const quiz = useTypedSelector(state => state.quiz)

  if (!quiz) {
    return <div>No quiz</div>
  }
  const quizItems = quiz.items

  const itemAnswers = useTypedSelector(
    state => state.quizAnswer.quizAnswer.itemAnswers,
  )
  const itemAnswer = itemAnswers.find(ia => ia.quizItemId === item.id)
  const intData = itemAnswer && itemAnswer.intData

  if (!itemAnswer) {
    return <LaterQuizItemAddition item={item} />
  }

  return (
    <FormControl fullWidth={true}>
      <GridRow
        container={true}
        justify="flex-start"
        alignItems="center"
        backgroundIsGray={backgroundShouldBeColored(quizItems, item.id)}
      >
        <SmallCenteredGrid
          matchesSmall={matchesSmall}
          item={true}
          xs={12}
          sm={5}
          md={4}
        >
          <StyledFormLabel>
            <Typography variant="body1">{item.texts[0].title}</Typography>
          </StyledFormLabel>
        </SmallCenteredGrid>
        <Grid item={true} xs={12} sm={7} md={8}>
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
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const minLabel = item.texts[0].minLabel
  const maxLabel = item.texts[0].maxLabel
  const theme = useTheme()

  if (item.minValue && item.maxValue) {
    number_of_options = item.maxValue - item.minValue + 1
  }

  const alternatives = Array.from(
    { length: number_of_options },
    (v, i) => (item.minValue ? item.minValue : 1) + i,
  )

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

      <WideGridItem>
        <RadioGroup
          row={true}
          aria-label="agreement"
          name="agreement"
          value={`${intData}`}
          onChange={handleIntDataChange}
        >
          <Grid
            container={true}
            justify={number_of_options <= 12 ? "space-between" : "flex-start"}
          >
            {alternatives.map(number => (
              <StyledOptionItem key={number}>
                <FormControlLabel
                  value={`${number}`}
                  control={
                    <StyledRadio
                      color="primary"
                      disabled={answerLocked ? true : false}
                      palette={theme.palette}
                    />
                  }
                  label={`${number}`}
                  labelPlacement="start"
                />
              </StyledOptionItem>
            ))}
          </Grid>
        </RadioGroup>
      </WideGridItem>
    </Grid>
  )
}

export default Scale
