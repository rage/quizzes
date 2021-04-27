import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { GridDirection, GridSize } from "@material-ui/core/Grid"
import { SpaciousTypography } from "./styleComponents"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem, QuizItemOption, QuizItemAnswer } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import MarkdownText from "./MarkdownText"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import ThemeProviderContext from "../contexes/themeProviderContext"
import ClickableChoiceButton from "./ClickableChoiceButton"

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 1.25rem;
  margin-right: 0.25rem;
`

interface ChoicesContainerProps {
  direction: string
  providedStyles: string | undefined
}

const ChoicesContainer = styled.div<ChoicesContainerProps>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 15px 10px;
  background: #f5f5f5;
  border-radius: 7px;
  ${({ direction }) => direction === "column" && "width: 100%"}
  ${({ providedStyles }) => providedStyles && providedStyles}
`

const CentralizedOnSmallScreenTypography = styled(Typography)`
  position: relative;
  top: 2px;
  @media only screen and (max-width: 600px) {
    text-align: center;
  }
`

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
  direction?: string
  message?: string
}

const LeftBorderedDiv = styled.div<LeftBorderedDivProps>`
  display: flex;
  border-left: 6px solid ${({ correct }) => (correct ? "#047500" : "#DB0000")};
  box-sizing: border-box;
  padding: 3px;
  padding: 0.5rem 0 0.5rem 0.5rem;
  margin-top: 1rem;
  margin-bottom: 5px !important;
  p:nth-of-type(1) {
    display: none;
  }
  p:nth-of-type(2) {
    margin-top: -0.25rem;
    padding: 0 0 0 0.5rem;
  }
  ${({ direction }) => direction === "column" && "width: 70%;"}
`

const LeftAlignedMarkdownText = styled(MarkdownText)`
  text-align: left;
`

const justADiv = styled.div``

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

  const options = item.options

  let direction: GridDirection = "row"
  let questionWidth: 5 | 12 = 5
  let optionWidth: GridSize = "auto"

  return (
    <div role="group" aria-label={item.title}>
      <ItemContent
        direction={direction}
        providedStyles={themeProvider.multipleChoiceItemContentStyles}
      >
        <div>
          <ItemInformation
            item={item}
            itemAnswer={itemAnswer}
            direction={direction}
            questionWidth={questionWidth}
          />

          <ChoicesContainer
            direction={direction}
            providedStyles={themeProvider.optionContainerStyles}
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
        </div>
        <FeedbackPortion item={item} />
      </ItemContent>
    </div>
  )
}

type ItemInformationProps = {
  questionWidth: 5 | 12
  itemAnswer: QuizItemAnswer | undefined
  item: QuizItem
  direction: string
}

const ItemInformation: React.FunctionComponent<ItemInformationProps> = ({
  direction,
  item,
}) => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  if (!languageInfo) {
    return <div />
  }

  const multipleChoiceLabels = languageInfo.multipleChoice

  const selectOptionsLabel = answerLocked
    ? ""
    : item.multi
    ? multipleChoiceLabels.chooseAllSuitableOptionsLabel
    : direction
    ? multipleChoiceLabels.selectCorrectAnswerLabel
    : ""

  const { title, body } = item

  return (
    <QuestionContainer>
      {direction !== "row" && title && (
        <LeftAlignedMarkdownText
          Component={SpaciousTypography}
          removeParagraphs
          variant="subtitle1"
          id={`item-question-${title}`}
        >
          {title}
        </LeftAlignedMarkdownText>
      )}

      {body && <MarkdownText>{body}</MarkdownText>}

      {selectOptionsLabel && (
        <SelectOptionsLabelTypography
          variant="subtitle1"
          variantMapping={{ subtitle1: "p" }}
          direction={direction}
        >
          {selectOptionsLabel}
        </SelectOptionsLabelTypography>
      )}
    </QuestionContainer>
  )
}

const SelectOptionsLabelTypography = styled(Typography)<{
  direction: string
}>`
  color: 6b6b6b;
  ${({ direction }) => direction === "column" && "margin: 0 auto 1rem;"}
`

type OptionProps = {
  option: QuizItemOption
  optionWidth: GridSize
  shouldBeGray: boolean
}

const Option: React.FunctionComponent<OptionProps> = ({
  option,
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

  const direction = item.direction
  const text = option

  if (!itemAnswer && !quizDisabled) {
    return <div>Answer cannot be retrieved</div>
  }

  const handleOptionChange = (optionId: string) => () => {
    dispatch(quizAnswerActions.changeChosenOption(item.id, optionId))
  }
  const optionAnswers = itemAnswer && itemAnswer.optionAnswers
  /* please use optionAnswers.length to make your life easier */
  const answerLocked = userQuizState && userQuizState.status === "locked"

  const lengthOfSelectedOption: any = itemAnswer?.optionAnswers.length

  const optionIsSelected =
    (optionAnswers &&
      optionAnswers.some(oa => oa.quizOptionId === option.id)) ||
    false

  if (!displayFeedback) {
    return (
      <OptionWrapper
        direction={direction}
        shouldBeGray={shouldBeGray}
        providedStyles={themeProvider.optionWrapperStyles}
      >
        <ClickableChoiceButton
          direction={direction}
          selected={!!optionIsSelected}
          revealed={false}
          correct={false}
          state={optionIsSelected}
          onClick={handleOptionChange(option.id)}
          disabled={!optionIsSelected && lengthOfSelectedOption >= 5}
          aria-pressed={optionIsSelected}
        >
          <MarkdownText Component={justADiv} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ClickableChoiceButton>
      </OptionWrapper>
    )
  }

  const clickOptions = answerLocked
    ? {}
    : { onClick: handleOptionChange(option.id) }

  if (direction === "column") {
    return (
      <React.Fragment>
        <OptionWrapper
          direction={direction}
          shouldBeGray={shouldBeGray}
          providedStyles={themeProvider.optionWrapperStyles}
        >
          <ClickableChoiceButton
            revealed
            state={optionIsSelected}
            direction={direction}
            selected={!!optionIsSelected}
            correct={option.correct}
            disabled={!optionIsSelected && lengthOfSelectedOption >= 5}
            {...clickOptions}
            aria-selected={optionIsSelected}
            aria-label={`${text.title}-${
              option.correct ? "correct" : "incorrect"
            }`}
          >
            <MarkdownText Component={justADiv} removeParagraphs>
              {text.title}
            </MarkdownText>
          </ClickableChoiceButton>
        </OptionWrapper>
      </React.Fragment>
    )
  }

  // multiple items
  return (
    <>
      <OptionWrapper direction={direction} shouldBeGray={shouldBeGray}>
        <ClickableChoiceButton
          revealed
          state={optionIsSelected}
          direction={direction}
          selected={!!optionIsSelected}
          correct={option.correct}
          disabled={!optionIsSelected && lengthOfSelectedOption >= 5}
          {...clickOptions}
          aria-selected={optionIsSelected}
          aria-label={`${text.title}-${
            option.correct ? "correct" : "incorrect"
          }`}
        >
          <MarkdownText Component={justADiv} removeParagraphs>
            {text.title}
          </MarkdownText>
        </ClickableChoiceButton>
      </OptionWrapper>
    </>
  )
}

interface IFeedbackPortionProps {
  item: QuizItem
  selectedOption?: QuizItemOption
  direction?: string
}

const FeedbackPortion: React.FunctionComponent<IFeedbackPortionProps> = ({
  item,
  direction,
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

  const generalLabels = languageLabels.general

  const optionAnswers = itemAnswer && itemAnswer.optionAnswers

  const optionAnswer = optionAnswers[0]

  const selectedOption = item.options.find(
    o => o.id === optionAnswer.quizOptionId,
  )

  let feedbackMessage
  if (
    item.usesSharedOptionFeedbackMessage &&
    item.sharedOptionFeedbackMessage !== undefined
  ) {
    feedbackMessage = item.sharedOptionFeedbackMessage
  } else {
    const optionSuccess = selectedOption
      ? selectedOption.successMessage
      : undefined
    const optionFailure = selectedOption
      ? selectedOption.failureMessage
      : undefined

    const text = item
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
        direction={direction}
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
    <FeedbackDiv correct={correct} direction={direction}>
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
  ${({ direction, shouldBeGray, providedStyles }) =>
    direction
      ? `
      display: flex;
      justify-content: center;
      background-color: #F5F5F5;
      ${providedStyles}
    `
      : `
      margin-left: 1rem;
      `}
`

type OptionWrapperProps = {
  direction: string
  shouldBeGray: boolean
  providedStyles?: string
}

export default MultipleChoice
