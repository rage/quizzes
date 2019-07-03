import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Button, Grid, Typography } from "@material-ui/core"
import { GridDirection, GridSize } from "@material-ui/core/Grid"
import { SpaciousTypography } from "./styleComponents"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem } from "../modelTypes"

type MultipleChoiceProps = {
  item: QuizItem
}

const ChoicesContainer = styled(
  ({ singleItem, optionContainerWidth, ...others }) => (
    <Grid item={true} xs={optionContainerWidth}>
      <Grid container={true} {...others} />
    </Grid>
  ),
)`
  padding-top: 7;
  flex-wrap: ${({ singleItem }) => (singleItem ? "nowrap" : "wrap")};
`

const ChoiceButton = styled(Button)`
  text-transform: none;
  margin: 0.5em 0;
`

const RevealedChoiceButton = styled(({ selected, correct, ...others }) => (
  <ChoiceButton variant={selected ? "contained" : "outlined"} {...others} />
))`
  ${props =>
    props.selected
      ? `
    color: white;
    background-color: ${props.correct ? "green" : "red"};
    `
      : props.correct
      ? `
    color: green;
    outline-color: green;`
      : ``}
`

const BottomMarginedGrid = styled(Grid)`
  marginbottom: 10px;
`

const LeftBorderedTypography = styled(
  ({ barColor, ...others }: { barColor: string }) => <Typography {...others} />,
)`
  border-left: 4px solid ${({ barColor }) => barColor};
  padding: 3;
  margin-bottom: 5;
`

const SolutionTypography = styled(
  ({ correct, ...others }: { correct: boolean }) => (
    <LeftBorderedTypography barColor={correct ? "green" : "red"} {...others} />
  ),
)`
  margin-bottom: 0;
`

const MultipleChoice: React.FunctionComponent<MultipleChoiceProps> = ({
  item,
}) => {
  const dispatch = useDispatch()

  const handleOptionChange = ((itemId: string) => (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(itemId, optionId)))(item.id)

  const quiz = useTypedSelector(state => state.quiz)
  const answer = useTypedSelector(state => state.quizAnswer)
  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.multipleChoice,
  )

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  const correct = itemAnswer.correct
  const optionAnswers = itemAnswer.optionAnswers

  const answered = answer.id ? true : false
  const itemTitle = item.texts[0].title
  const itemBody = item.texts[0].body
  const successMessage = item.texts[0].successMessage
  const failureMessage = item.texts[0].failureMessage
  const multi = item.multi

  const singleItem = quiz.items.length === 1

  const options = item.options

  let direction: GridDirection = "row"
  let questionWidth: 6 | 12 = 6
  let optionContainerWidth: 6 | 12 = 6
  let optionWidth: GridSize

  if (singleItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
    const width =
      maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
    optionContainerWidth = 12
    optionWidth = Math.min(width, 12) as GridSize
    questionWidth = 12
    direction = "column"
  }

  return (
    <BottomMarginedGrid container direction={direction}>
      <Grid item sm={questionWidth}>
        {singleItem ? (
          ""
        ) : (
          <>
            <SpaciousTypography variant="h6">{itemTitle}</SpaciousTypography>
            {itemBody && (
              <SpaciousTypography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: itemBody }}
              />
            )}
          </>
        )}
        {multi && !answered ? (
          <Typography variant="subtitle1">
            {languageInfo.chooseAllSuitableOptionsLabel}
          </Typography>
        ) : (
          ""
        )}
        {answered && !singleItem ? (
          <SolutionTypography correct={correct} variant="body1">
            {correct ? successMessage : failureMessage}
          </SolutionTypography>
        ) : (
          ""
        )}
      </Grid>

      <ChoicesContainer
        direction={direction}
        justify="space-between"
        singleItem={singleItem}
        optionContainerWidth={optionContainerWidth}
      >
        {options
          .sort((o1, o2) => o2.order - o1.order)
          .map(option => {
            const selected = optionAnswers.find(
              oa => oa.quizOptionId === option.id,
            )
            const text = option.texts[0]
            const feedbackMessage = option.correct
              ? selected
                ? text.successMessage
                : text.failureMessage
              : selected
              ? text.failureMessage
              : text.successMessage
            const feedbackColor = option.correct
              ? selected
                ? "green"
                : "white"
              : selected
              ? "red"
              : "white"
            return answered ? (
              singleItem ? (
                <Grid item={true}>
                  <Grid container direction={direction} key={option.id}>
                    <Grid item sm={optionWidth}>
                      <RevealedChoiceButton
                        selected={selected}
                        correct={option.correct}
                        fullWidth
                      >
                        {text.title}
                      </RevealedChoiceButton>
                    </Grid>
                    <Grid item>
                      <LeftBorderedTypography
                        variant="body1"
                        barColor={feedbackColor}
                      >
                        {feedbackMessage}
                      </LeftBorderedTypography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item key={option.id}>
                  <RevealedChoiceButton
                    selected={selected}
                    correct={option.correct}
                    fullWidth
                  >
                    {text.title}
                  </RevealedChoiceButton>
                </Grid>
              )
            ) : (
              <Grid item sm={optionWidth} key={option.id}>
                <ChoiceButton
                  variant="outlined"
                  fullWidth
                  color={selected ? "primary" : "default"}
                  onClick={handleOptionChange(option.id)}
                >
                  {text.title}
                </ChoiceButton>
              </Grid>
            )
          })}
      </ChoicesContainer>
    </BottomMarginedGrid>
  )
}

export default MultipleChoice
