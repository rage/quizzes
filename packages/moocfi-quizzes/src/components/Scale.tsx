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
import MarkdownText from "./MarkdownText"

type ScaleProps = {
  item: QuizItem
}

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
  padding-left: 0.15rem;

  MuiRadio-root {
    color: #4f4f4f;
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

  const theme = useTheme()
  const matchesSmall = useMediaQuery(theme.breakpoints.down("xs"))

  const itemAnswers = useTypedSelector(
    state => state.quizAnswer.quizAnswer.itemAnswers,
  )
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)
  const itemAnswer = itemAnswers.find(ia => ia.quizItemId === item.id)
  const intData = itemAnswer && itemAnswer.intData

  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  return (
    <FormControl fullWidth={true}>
      <Grid container={true} justify="flex-start" alignItems="center">
        <SmallCenteredGrid
          matchesSmall={matchesSmall}
          item={true}
          xs={12}
          sm={5}
          md={4}
        >
          <StyledFormLabel>
            <MarkdownText Component={Typography} variant="body1">
              {item.texts[0].title}
            </MarkdownText>
          </StyledFormLabel>
        </SmallCenteredGrid>
        <Grid item={true} xs={12} sm={7} md={8}>
          <ScaleOptions
            handleIntDataChange={handleIntDataChange}
            item={item}
            intData={typeof intData === "number" ? intData : undefined}
          />
        </Grid>
      </Grid>
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
