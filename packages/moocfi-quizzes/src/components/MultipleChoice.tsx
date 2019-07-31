import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Button, Grid, Typography, Icon } from "@material-ui/core"
import {
  GridDirection,
  GridSize,
  GridItemsAlignment,
} from "@material-ui/core/Grid"
import { SpaciousTypography } from "./styleComponents"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem, QuizItemOption, QuizItemAnswer } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import MarkdownText from "./MarkdownText"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

/*const ChoicesContainer = styled(
  ({ singleItem, optionContainerWidth, ...others }) => (
    <Grid item container direction={singleItem ? "column" : "row"} alignItems={singleItem ? "center" : "baseline"} xs={optionContainerWidth}>
      <Grid item container xs={singleItem ? 8 : 12} {...others} />
    </Grid>
  ),
)`
  padding-top: 7;
`*/

const ChoicesContainer = styled(Grid)`
  padding-top: 7;
`

//   flex-wrap: ${({ singleItem }) => (singleItem ? "nowrap" : "wrap")};

const ChoiceButton = styled(Button)`
  text-transform: none;
  margin: 0.5em 0;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`

const IconWrapper = styled.div`
  margin: 0.5rem;
`

const SuccessIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faCheck} />
  </IconWrapper>
)

const FailureIcon = () => (
  <IconWrapper>
    <FontAwesomeIcon icon={faTimes} />
  </IconWrapper>
)

const RevealedChoiceButton = styled(({ selected, correct, ...others }) => {
  return (
    <ChoiceButton variant={selected ? "contained" : "outlined"} {...others}>
      {selected ? correct ? <SuccessIcon /> : <FailureIcon /> : ""}
      {others.children}
    </ChoiceButton>
  )
})`
  ${props =>
    props.selected
      ? `
    color: white;
    background-color: ${props.correct ? "#047500" : "#DB0000"};
    `
      : props.correct
      ? `
    color: #047500;
    border-color: #047500;
    border-width: 3px
    `
      : ``}
`

const BottomMarginedGrid = styled(Grid)`
  margin-bottom: 10px;
`

const LeftBorderedTypography = styled(({ barColor, ...others }) => (
  <Typography {...others} />
))`
  border-left: 4px solid ${({ barColor }) => barColor};
  padding: 3;
  margin-bottom: 5;
`

const SolutionTypography = styled(({ correct, ...others }) => (
  <LeftBorderedTypography
    barColor={correct ? "#047500" : "#DB0000"}
    {...others}
  />
))`
  margin-bottom: 0;
`

type MultipleChoiceProps = {
  item: QuizItem
}

const MultipleChoice: React.FunctionComponent<MultipleChoiceProps> = ({
  item,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  if (!quiz) {
    return <div />
  }
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  if (!itemAnswer) {
    return <LaterQuizItemAddition item={item} />
  }

  const onlyOneItem = quiz.items.length === 1

  const options = item.options

  let direction: GridDirection = "row"
  let alignItems: GridItemsAlignment = "baseline"
  let questionWidth: 6 | 12 = 6
  let optionContainerWidth: GridSize = 6
  let optionWidth: GridSize = "auto"

  if (onlyOneItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
    const width =
      maxOptionLength > 100 ? 12 : Math.ceil(maxOptionLength / (8 + 1 / 3))
    optionContainerWidth = 8
    optionWidth = 12
    questionWidth = 12
    direction = "column"
    alignItems = "center"
  }

  return (
    <BottomMarginedGrid container direction={direction} alignItems={alignItems}>
      <ItemInformation
        item={item}
        itemAnswer={itemAnswer}
        onlyOneItem={onlyOneItem}
        questionWidth={questionWidth}
      />

      <ChoicesContainer
        item
        container
        justify="space-evenly"
        xs={optionContainerWidth}
      >
        {options
          .sort((o1, o2) => o1.order - o2.order)
          .map(option => {
            return (
              <Option
                key={option.id}
                option={option}
                optionWidth={optionWidth}
              />
            )
          })}
      </ChoicesContainer>
    </BottomMarginedGrid>
  )
}

type ItemInformationProps = {
  questionWidth: 6 | 12
  itemAnswer: QuizItemAnswer
  item: QuizItem
  onlyOneItem: boolean
}

const ItemInformation: React.FunctionComponent<ItemInformationProps> = ({
  questionWidth,
  onlyOneItem,
  item,
  itemAnswer,
}) => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const answerLocked = userQuizState && userQuizState.status === "locked"
  const displayFeedback = useTypedSelector(state => state.feedbackDisplayed)

  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  if (!languageInfo) {
    return <div />
  }

  const multipleChoiceLabels = languageInfo.multipleChoice

  const { title, body, successMessage, failureMessage } = item.texts[0]

  if (onlyOneItem && !answerLocked) {
    return (
      <Grid item xs={questionWidth}>
        <SpaciousTypography variant="h6">
          {item.multi
            ? multipleChoiceLabels.chooseAllSuitableOptionsLabel
            : multipleChoiceLabels.selectCorrectAnswerLabel}
        </SpaciousTypography>
      </Grid>
    )
  } else if (onlyOneItem) {
    return <></>
  }

  return (
    <Grid item xs={questionWidth}>
      <SpaciousTypography variant="h6">{title}</SpaciousTypography>

      {body && <MarkdownText>{body}</MarkdownText>}

      {!answerLocked && item.multi && (
        <Typography variant="subtitle1">
          {multipleChoiceLabels.chooseAllSuitableOptionsLabel}
        </Typography>
      )}

      {displayFeedback &&
        !onlyOneItem &&
        ((itemAnswer.correct && successMessage) ||
          (!itemAnswer.correct && failureMessage)) && (
          <SolutionTypography
            correct={itemAnswer.correct ? true : false}
            variant="body1"
          >
            {itemAnswer.correct
              ? multipleChoiceLabels.answerCorrectLabel
              : multipleChoiceLabels.answerIncorrectLabel}
            <br />
            {itemAnswer.correct ? successMessage : failureMessage}
          </SolutionTypography>
        )}
    </Grid>
  )
}

type OptionProps = {
  option: QuizItemOption
  optionWidth: GridSize
}

const Option: React.FunctionComponent<OptionProps> = ({
  option,
  optionWidth,
}) => {
  const dispatch = useDispatch()

  const items = useTypedSelector(state => state.quiz!.items)
  const item = items.find(i => i.id === option.quizItemId)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  const displayFeedback = useTypedSelector(state => state.feedbackDisplayed)

  if (!item) {
    // should be impossible
    return <div>Cannot find related item</div>
  }
  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )
  if (!itemAnswer) {
    // should be impossible
    return <div>Cannot find related item answer</div>
  }

  const onlyOneItem = items.length === 1

  const handleOptionChange = (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(item.id, optionId))

  const optionAnswers = itemAnswer.optionAnswers
  const answerLocked = userQuizState && userQuizState.status === "locked"

  const optionIsSelected = optionAnswers.some(
    oa => oa.quizOptionId === option.id,
  )
  const text = option.texts[0]

  // option incorrect, selected -> success; option correct, not selected -> success! Otherwise failure
  const feedbackMessage =
    option.correct === optionIsSelected
      ? text.successMessage
      : text.failureMessage

  const feedbackColor = optionIsSelected
    ? option.correct
      ? "#047500"
      : "#DB0000"
    : "white"

  if (!displayFeedback) {
    return (
      <Grid item={true} xs={optionWidth} key={option.id}>
        <ChoiceButton
          variant={optionIsSelected ? "contained" : "outlined"}
          fullWidth
          color={optionIsSelected ? "primary" : "default"}
          onClick={handleOptionChange(option.id)}
        >
          {text.title}
        </ChoiceButton>
      </Grid>
    )
  }

  const clickOptions = answerLocked
    ? {}
    : { onClick: handleOptionChange(option.id) }

  if (onlyOneItem) {
    return (
      <React.Fragment>
        <Grid item={true} xs={optionWidth}>
          <RevealedChoiceButton
            selected={optionIsSelected}
            correct={option.correct}
            {...clickOptions}
            fullWidth
          >
            {text.title}
          </RevealedChoiceButton>
        </Grid>

        {feedbackMessage && (
          <Grid item xs={optionWidth}>
            <LeftBorderedTypography variant="body1" barColor={feedbackColor}>
              {feedbackMessage}
            </LeftBorderedTypography>
          </Grid>
        )}
      </React.Fragment>
    )
  }

  return (
    <Grid item={true} xs={optionWidth}>
      <RevealedChoiceButton
        selected={optionIsSelected}
        correct={option.correct}
        {...clickOptions}
        fullWidth
      >
        {text.title}
      </RevealedChoiceButton>
    </Grid>
  )
}

export default MultipleChoice
