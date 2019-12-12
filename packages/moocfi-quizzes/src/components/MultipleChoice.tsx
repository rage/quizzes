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
import {
  faCheck,
  faTimes,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"
import ThemeProviderContext from "../contexes/themeProviderContext"
import ChoiceButton from "./ChoiceButton"

const ChoicesContainer = styled(Grid)`
  padding-top: 7;
`

const CentralizedOnSmallScreenTypography = styled(Typography)`
  @media only screen and (max-width: 600px) {
    text-align: center;
  }
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

const AttentionIcon = styled(FontAwesomeIcon)`
  font-size: 30px !important;
`

const BottomMarginedGrid = styled(Grid)`
  margin-bottom: 10px;
`

interface ILeftBorderedDivProps {
  correct: boolean
  onlyOneItem?: boolean
}

const LeftBorderedDiv = styled.div<ILeftBorderedDivProps>`
  border-left: 6px solid ${({ correct }) => (correct ? "#047500" : "#DB0000")};
  box-sizing: border-box;
  padding: 3px;
  padding-left: 10px;
  margin-bottom: 5px !important;
  ${({ onlyOneItem }) => onlyOneItem && "width: 70%;"}
`

const LeftAlignedMarkdownText = styled(MarkdownText)`
  text-align: left;
`

type MultipleChoiceProps = {
  item: QuizItem
}

const MultipleChoice: React.FunctionComponent<MultipleChoiceProps> = ({
  item,
}) => {
  const quiz = useTypedSelector(state => state.quiz)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)

  if (!quiz) {
    return <div />
  }

  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  if (!itemAnswer && !quizDisabled) {
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
    optionContainerWidth = 12
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
          .map((option, index) => {
            return (
              <Option
                key={option.id}
                option={option}
                optionWidth={optionWidth}
                shouldBeGray={index % 2 === 0}
              />
            )
          })}
      </ChoicesContainer>

      {!onlyOneItem && <FeedbackPortion item={item} />}
    </BottomMarginedGrid>
  )
}

type ItemInformationProps = {
  questionWidth: 6 | 12
  itemAnswer: QuizItemAnswer | undefined
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

  const selectOptionsLabel = answerLocked
    ? ""
    : item.multi
    ? multipleChoiceLabels.chooseAllSuitableOptionsLabel
    : onlyOneItem
    ? multipleChoiceLabels.selectCorrectAnswerLabel
    : ""

  const { title, body, successMessage, failureMessage } = item.texts[0]

  return (
    <ItemInformationGridItem item xs={questionWidth}>
      {title && (
        <LeftAlignedMarkdownText
          Component={SpaciousTypography}
          removeParagraphs
          variant="subtitle1"
        >
          {title}
        </LeftAlignedMarkdownText>
      )}

      {body && <MarkdownText>{body}</MarkdownText>}

      {selectOptionsLabel && (
        <SelectOptionsLabelTypography variant="subtitle1">
          {selectOptionsLabel}
        </SelectOptionsLabelTypography>
      )}
    </ItemInformationGridItem>
  )
}

const ItemInformationGridItem = styled(Grid)`
  text-align: center;
`

const SelectOptionsLabelTypography = styled(Typography)`
  color: 6b6b6b;
`

type OptionProps = {
  option: QuizItemOption
  optionWidth: GridSize
  shouldBeGray: boolean
}

const Option: React.FunctionComponent<OptionProps> = ({
  option,
  optionWidth,
  shouldBeGray,
}) => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const dispatch = useDispatch()
  const items = useTypedSelector(state => state.quiz!.items)
  const item = items.find(i => i.id === option.quizItemId)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )
  const displayFeedback = useTypedSelector(state => state.feedbackDisplayed)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  if (!item || !languageLabels) {
    // should be impossible
    return <div>Cannot find related item or language</div>
  }
  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )

  const onlyOneItem = items.length === 1
  const text = option.texts[0]

  if (!itemAnswer && !quizDisabled) {
    return <div>Answer cannot be retrieved</div>
  }

  const handleOptionChange = (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(item.id, optionId))

  const optionAnswers = itemAnswer && itemAnswer.optionAnswers
  const answerLocked = userQuizState && userQuizState.status === "locked"

  const optionIsSelected =
    optionAnswers && optionAnswers.some(oa => oa.quizOptionId === option.id)

  if (!displayFeedback) {
    return (
      <OptionGridItem
        item
        xs={optionWidth}
        onlyOneItem={onlyOneItem}
        shouldBeGray={shouldBeGray}
        providedStyles={themeProvider.optionGridItemStyles}
      >
        <ChoiceButton
          onlyOneItem={onlyOneItem}
          selected={!!optionIsSelected}
          revealed={false}
          correct={false}
          onClick={handleOptionChange(option.id)}
          disabled={quizDisabled}
        >
          <MarkdownText Component={styled.div``} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ChoiceButton>
      </OptionGridItem>
    )
  }

  const clickOptions = answerLocked
    ? {}
    : { onClick: handleOptionChange(option.id) }

  if (onlyOneItem) {
    return (
      <React.Fragment>
        <OptionGridItem
          item
          xs={optionWidth}
          onlyOneItem={onlyOneItem}
          shouldBeGray={shouldBeGray}
          providedStyles={themeProvider.optionGridItemStyles}
        >
          <ChoiceButton
            revealed
            onlyOneItem={onlyOneItem}
            selected={!!optionIsSelected}
            correct={option.correct}
            {...clickOptions}
          >
            <MarkdownText Component={styled.div``} removeParagraphs>
              {text.title}
            </MarkdownText>
          </ChoiceButton>
        </OptionGridItem>

        {optionIsSelected && (
          <OptionGridItem
            item
            xs={optionWidth}
            onlyOneItem={onlyOneItem}
            shouldBeGray={shouldBeGray}
            providedStyles={themeProvider.optionGridItemStyles}
          >
            <FeedbackPortion item={item} selectedOption={option} />
          </OptionGridItem>
        )}
      </React.Fragment>
    )
  }

  // multiple items
  return (
    <>
      <OptionGridItem
        item
        xs={optionWidth}
        onlyOneItem={onlyOneItem}
        shouldBeGray={shouldBeGray}
      >
        <ChoiceButton
          revealed
          onlyOneItem={onlyOneItem}
          selected={!!optionIsSelected}
          correct={option.correct}
          {...clickOptions}
        >
          <MarkdownText Component={styled.div``} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ChoiceButton>
      </OptionGridItem>
    </>
  )
}

interface IFeedbackPortionProps {
  item: QuizItem
  selectedOption?: QuizItemOption
}

const FeedbackPortion: React.FunctionComponent<IFeedbackPortionProps> = ({
  item,
  selectedOption,
}) => {
  const themeProvider = React.useContext(ThemeProviderContext)
  const items = useTypedSelector(state => state.quiz!.items)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )
  const feedbackDisplayed = useTypedSelector(state => state.feedbackDisplayed)

  if (!feedbackDisplayed) {
    return <div style={{ display: "none" }} />
  }

  if (!item || !languageLabels) {
    // should be impossible
    return <div>Cannot find related item or language</div>
  }
  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )
  if (!itemAnswer) {
    // should be impossible
    return <div>Cannot find related item answer</div>
  }

  const onlyOneItem = items.length === 1
  const generalLabels = languageLabels.general

  let feedbackMessage
  if (
    item.usesSharedOptionFeedbackMessage &&
    item.texts[0].sharedOptionFeedbackMessage !== undefined
  ) {
    feedbackMessage = item.texts[0].sharedOptionFeedbackMessage
  } else {
    const optionSuccess = selectedOption
      ? selectedOption.texts[0].successMessage
      : undefined
    const optionFailure = selectedOption
      ? selectedOption.texts[0].failureMessage
      : undefined

    const text = item.texts[0]
    const successMessage =
      optionSuccess || text.successMessage || generalLabels.answerCorrectLabel
    const failureMessage =
      optionFailure || text.failureMessage || generalLabels.answerIncorrectLabel

    feedbackMessage = itemAnswer.correct ? successMessage : failureMessage
  }

  const correct = (itemAnswer.correct && true) || false

  const ThemedDiv = themeProvider.feedbackMessage

  const FeedbackDiv = ThemedDiv || LeftBorderedDiv

  return (
    <FeedbackDiv correct={correct} onlyOneItem={onlyOneItem}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm="auto">
          <CentralizedOnSmallScreenTypography variant="body1">
            <AttentionIcon icon={faExclamationCircle} />
          </CentralizedOnSmallScreenTypography>
        </Grid>
        <Grid item xs={12} sm={10}>
          <CentralizedOnSmallScreenTypography variant="body1">
            {feedbackMessage}
          </CentralizedOnSmallScreenTypography>
        </Grid>
      </Grid>
    </FeedbackDiv>
  )
}

const OptionGridItem = styled(Grid)<OptionGridItemProps>`
  ${({ onlyOneItem, shouldBeGray }) =>
    onlyOneItem
      ? `
      display: flex;
      justify-content: center;
      background-color: ${shouldBeGray ? `#605c980d` : `inherit`};
    `
      : ``}
  ${({ providedStyles }) => providedStyles}
`

type OptionGridItemProps = {
  onlyOneItem: boolean
  shouldBeGray: boolean
  providedStyles?: string
}

export default MultipleChoice
