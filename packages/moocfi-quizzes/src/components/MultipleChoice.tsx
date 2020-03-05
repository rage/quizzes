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

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 1.25rem;
  margin-right: 0.25rem;
`

interface ChoicesContainerProps {
  direction: string
  onlyOneItem: boolean
}

const ChoicesContainer = styled.div<ChoicesContainerProps>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${({ direction }) => direction};
  padding-top: 7;
  ${({ onlyOneItem }) => onlyOneItem && "width: 100%"}
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

interface ItemContentProps {
  direction: string
  providedStyles: string | undefined
}

const ItemContent = styled.div<ItemContentProps>`
  margin-bottom: 10px;
  > div:first-of-type {
    display: flex;
    justify-content: space-between;
    flex-direction: ${({ direction }) => direction};
  }
  ${({ providedStyles }) => providedStyles}
`

export interface LeftBorderedDivProps {
  correct: boolean | undefined
  onlyOneItem?: boolean
  message?: string
}

const LeftBorderedDiv = styled.div<LeftBorderedDivProps>`
  display: flex;
  border-left: 6px solid ${({ correct }) => (correct ? "#047500" : "#DB0000")};
  box-sizing: border-box;
  padding: 3px;
  padding: 0.5rem 0 0.5rem 0.5rem;
  margin-bottom: 5px !important;
  p:nth-of-type(1) {
    display: none;
  }
  p:nth-of-type(2) {
    margin-top: -0.25rem;
    padding: 0 0 0 0.5rem;
  }
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
  const themeProvider = React.useContext(ThemeProviderContext)
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
  let questionWidth: 5 | 12 = 5
  let optionWidth: GridSize = "auto"

  if (onlyOneItem) {
    const maxOptionLength = Math.max(
      ...options.map(option => option.texts[0].title.length),
    )
  }

  return (
    <div role="group" aria-label={item.texts[0].title}>
      <ItemContent
        direction={direction}
        providedStyles={themeProvider.multipleChoiceItemContentStyles}
      >
        <div>
          <ItemInformation
            item={item}
            itemAnswer={itemAnswer}
            onlyOneItem={onlyOneItem}
            questionWidth={questionWidth}
          />

          <ChoicesContainer direction={direction} onlyOneItem={onlyOneItem}>
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
        </div>
        {!onlyOneItem && <FeedbackPortion item={item} />}
      </ItemContent>
    </div>
  )
}

type ItemInformationProps = {
  questionWidth: 5 | 12
  itemAnswer: QuizItemAnswer | undefined
  item: QuizItem
  onlyOneItem: boolean
}

const ItemInformation: React.FunctionComponent<ItemInformationProps> = ({
  onlyOneItem,
  item,
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
    <QuestionContainer>
      {title && (
        <LeftAlignedMarkdownText
          Component={SpaciousTypography}
          removeParagraphs
          variant="subtitle1"
          component="p"
          id="item-question"
        >
          {title}
        </LeftAlignedMarkdownText>
      )}

      {body && <MarkdownText>{body}</MarkdownText>}

      {selectOptionsLabel && (
        <SelectOptionsLabelTypography
          component="p"
          variant="subtitle1"
          onlyOneItem={onlyOneItem}
        >
          {selectOptionsLabel}
        </SelectOptionsLabelTypography>
      )}
    </QuestionContainer>
  )
}

const SelectOptionsLabelTypography = styled(Typography)<{
  onlyOneItem: boolean
}>`
  color: 6b6b6b;
  ${({ onlyOneItem }) => onlyOneItem && "margin: 0 auto 1rem;"}
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
      <OptionWrapper
        onlyOneItem={onlyOneItem}
        shouldBeGray={shouldBeGray}
        providedStyles={themeProvider.optionWrapperStyles}
      >
        <ChoiceButton
          onlyOneItem={onlyOneItem}
          selected={!!optionIsSelected}
          revealed={false}
          correct={false}
          onClick={handleOptionChange(option.id)}
          disabled={quizDisabled}
          aria-selected={optionIsSelected}
        >
          <MarkdownText Component={styled.div``} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ChoiceButton>
      </OptionWrapper>
    )
  }

  const clickOptions = answerLocked
    ? {}
    : { onClick: handleOptionChange(option.id) }

  if (onlyOneItem) {
    return (
      <React.Fragment>
        <OptionWrapper
          onlyOneItem={onlyOneItem}
          shouldBeGray={shouldBeGray}
          providedStyles={themeProvider.optionWrapperStyles}
        >
          <ChoiceButton
            revealed
            onlyOneItem={onlyOneItem}
            selected={!!optionIsSelected}
            correct={option.correct}
            {...clickOptions}
            aria-selected={optionIsSelected}
            aria-label={`${text.title}-${
              option.correct ? "correct" : "incorrect"
            }`}
          >
            <MarkdownText Component={styled.div``} removeParagraphs>
              {text.title}
            </MarkdownText>
          </ChoiceButton>
        </OptionWrapper>

        {optionIsSelected && (
          <OptionWrapper
            onlyOneItem={onlyOneItem}
            shouldBeGray={shouldBeGray}
            providedStyles={themeProvider.optionWrapperStyles}
          >
            <FeedbackPortion item={item} selectedOption={option} />
          </OptionWrapper>
        )}
      </React.Fragment>
    )
  }

  // multiple items
  return (
    <>
      <OptionWrapper onlyOneItem={onlyOneItem} shouldBeGray={shouldBeGray}>
        <ChoiceButton
          revealed
          onlyOneItem={onlyOneItem}
          selected={!!optionIsSelected}
          correct={option.correct}
          {...clickOptions}
          aria-selected={optionIsSelected}
          aria-label={`${text.title}-${
            option.correct ? "correct" : "incorrect"
          }`}
        >
          <MarkdownText Component={styled.div``} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ChoiceButton>
      </OptionWrapper>
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

  if (ThemedDiv) {
    return (
      <ThemedDiv
        correct={correct}
        onlyOneItem={onlyOneItem}
        message={
          correct
            ? generalLabels.answerCorrectLabel
            : generalLabels.answerIncorrectLabel
        }
      >
        <CentralizedOnSmallScreenTypography variant="body1">
          {feedbackMessage}
        </CentralizedOnSmallScreenTypography>
      </ThemedDiv>
    )
  }

  return (
    <FeedbackDiv correct={correct} onlyOneItem={onlyOneItem}>
      <CentralizedOnSmallScreenTypography variant="body1">
        <AttentionIcon icon={faExclamationCircle} />
      </CentralizedOnSmallScreenTypography>
      <CentralizedOnSmallScreenTypography variant="body1">
        {feedbackMessage}
      </CentralizedOnSmallScreenTypography>
    </FeedbackDiv>
  )
}

const OptionWrapper = styled.div<OptionWrapperProps>`
  ${({ onlyOneItem, shouldBeGray, providedStyles }) =>
    onlyOneItem
      ? `
      display: flex;
      justify-content: center;
      background-color: ${shouldBeGray ? `#605c980d` : `inherit`};
      ${providedStyles}
    `
      : `
      margin-left: 1rem;
      `}
`

type OptionWrapperProps = {
  onlyOneItem: boolean
  shouldBeGray: boolean
  providedStyles?: string
}

export default MultipleChoice
