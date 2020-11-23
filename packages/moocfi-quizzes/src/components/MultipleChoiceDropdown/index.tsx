import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core"
import { GridDirection, GridSize } from "@material-ui/core/Grid"
import { SpaciousTypography } from "../styleComponents"
import { useTypedSelector } from "../../state/store"
import { QuizItem, QuizItemOption, QuizItemAnswer } from "../../modelTypes"
import LaterQuizItemAddition from "../LaterQuizItemAddition"
import MarkdownText from "../MarkdownText"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import ThemeProviderContext from "../../contexes/themeProviderContext"
import AnswerComponent from "./AnswerComponent"
import AnswerLockedComponent from "./AnswerLockedComponent"

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 0.8rem;
  padding-left: 10px;
  border-radius: 5px;
  min-height: 2rem;
`

const CentralizedOnSmallScreenTypography = styled(Typography)`
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
    display: grid;
    grid-template-columns: 1fr 40%;
    justify-content: space-between;
    flex-direction: ${({ direction }) => direction};
  }
  ${({ providedStyles }) => providedStyles}
`

export interface LeftBorderedDivProps {
  correct: boolean | undefined
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
  const dispatch = useDispatch()
  const quiz = useTypedSelector(state => state.quiz)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)
  const answer = useTypedSelector(state => state.quizAnswer.quizAnswer)

  const items = useTypedSelector(state => state.quiz!.items)
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const languageLabels = useTypedSelector(
    state => state.language.languageLabels,
  )
  const displayFeedback = useTypedSelector(state => state.feedbackDisplayed)

  if (!quiz) {
    return <div />
  }

  const ItemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  if (!ItemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const options = item.options

  let direction: GridDirection = "row"
  let questionWidth: 5 | 12 = 5
  let optionWidth: GridSize = "auto"

  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )

  if (!itemAnswer && !quizDisabled) {
    return <div>Answer cannot be retrieved</div>
  }

  const optionAnswers = itemAnswer && itemAnswer.optionAnswers
  const answerLocked = userQuizState && userQuizState.status === "locked"

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
            questionWidth={questionWidth}
          />
          <FormControl variant="outlined">
            {answerLocked ? (
              <AnswerLockedComponent options={options} quizItemId={item.id} />
            ) : (
              <AnswerComponent
                direction={direction}
                themeProvider={themeProvider}
                options={options}
                quizItemId={item.id}
                quizDisabled={quizDisabled}
              />
            )}
          </FormControl>
        </div>
        {<FeedbackPortion item={item} />}
      </ItemContent>
    </div>
  )
}

type ItemInformationProps = {
  questionWidth: 5 | 12
  itemAnswer: QuizItemAnswer | undefined
  item: QuizItem
}

const ItemInformation: React.FunctionComponent<ItemInformationProps> = ({
  item,
}) => {
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const answerLocked = userQuizState && userQuizState.status === "locked"
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  if (!languageInfo) {
    return <div />
  }

  const { title, body } = item

  return (
    <QuestionContainer>
      {title && (
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
    </QuestionContainer>
  )
}

interface IFeedbackPortionProps {
  item: QuizItem
  selectedOption?: QuizItemOption
}

const FeedbackPortion: React.FunctionComponent<IFeedbackPortionProps> = ({
  item,
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

  if (!optionAnswer) {
    return <div>No option selected.</div>
  }

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
    <FeedbackDiv correct={correct}>
      <CentralizedOnSmallScreenTypography variant="body1">
        <AttentionIcon icon={faExclamationCircle} />
      </CentralizedOnSmallScreenTypography>
      <CentralizedOnSmallScreenTypography variant="body1">
        {feedbackMessage}
      </CentralizedOnSmallScreenTypography>
    </FeedbackDiv>
  )
}

type OptionWrapperProps = {
  shouldBeGray: boolean
  providedStyles?: string
}

export default MultipleChoice
