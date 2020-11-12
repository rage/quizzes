import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../utils/string_tools"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import {
  SpaciousPaper,
  WhiteSpacePreservingTypography,
} from "./styleComponents"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import { ItemContent, StyledTextField } from "./styleComponents"
import MarkdownText from "./MarkdownText"
import { QuizItem, MiscEvent } from "../modelTypes"
import ThemeProviderContext from "../contexes/themeProviderContext"

type EssayProps = {
  item: QuizItem
}

interface ISubmitHelperTypographyProps {
  attemptWasRecentlyMade: boolean
}

interface AnswerPaperProps {
  providedStyles: string | undefined
}

const AnswerPaper = styled(SpaciousPaper)<AnswerPaperProps>`
  ${({ providedStyles }) => providedStyles}
`

interface AnswerFieldProps {
  providedStyles: string | undefined
}

const AnswerField = styled(StyledTextField)<AnswerFieldProps>`
  ${({ providedStyles }) => providedStyles}
`

const SubmitHelperTypography = styled(Typography)<ISubmitHelperTypographyProps>`
  && {
    height: 1rem;
    padding-top: 1rem;
    color: ${({ attemptWasRecentlyMade }) =>
      attemptWasRecentlyMade ? "#AD0000" : "#595959"};
    font-weight: ${({ attemptWasRecentlyMade }) =>
      attemptWasRecentlyMade ? "bold" : "inherit"}
    font-size: ${({ attemptWasRecentlyMade }) =>
      attemptWasRecentlyMade ? "1.2rem" : "0.85rem"};
  }
`

const Essay: React.FunctionComponent<EssayProps> = ({ item }) => {
  const themeProvider = React.useContext(ThemeProviderContext)

  const dispatch = useDispatch()

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const recentlyAttemptedDisabledSubmit = useTypedSelector(
    state => state.quizAnswer.attemptedDisabledSubmit,
  )

  const userQuizState = useTypedSelector(state => state.user.userQuizState)

  if (!languageInfo) {
    return <div />
  }
  const essayLabels = languageInfo.essay
  const itemBody = item.body
  const itemTitle = item.title

  let itemAnswer = quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id)

  let possibleToSubmit = true

  if (userQuizState) {
    if (userQuizState.status === "locked") {
      possibleToSubmit = false
    }
  }

  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const answerText = itemAnswer ? itemAnswer.textData || "" : ""

  const numOfWords = wordCount(answerText)
  const answerWithinLimits =
    numOfWords >= (item.minWords || 0) &&
    numOfWords <= (item.maxWords || 666666)

  const answerPortion = !possibleToSubmit ? (
    <>
      <Typography component="p" variant="subtitle1">
        {essayLabels.userAnswerLabel + ": "}
      </Typography>
      <AnswerPaper providedStyles={themeProvider.answerPaperStyles}>
        <WhiteSpacePreservingTypography variant="body1">
          {answerText}
        </WhiteSpacePreservingTypography>
      </AnswerPaper>
    </>
  ) : (
    <>
      <Typography>
        {essayLabels.wordLimitsGuidance(item.minWords, item.maxWords)}
      </Typography>
      <AnswerField
        rowNumber={item.order}
        variant="outlined"
        label={essayLabels.textFieldLabel}
        value={answerText}
        onChange={handleTextDataChange}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
        providedStyles={themeProvider.answerFieldStyles}
        id="essay-text-field"
      />
      <div>
        <Typography>
          {essayLabels.currentNumberOfWordsLabel}: {numOfWords}
        </Typography>

        <SubmitHelperTypography
          attemptWasRecentlyMade={recentlyAttemptedDisabledSubmit}
        >
          {answerWithinLimits ? "" : essayLabels.conformToLimitsToSubmitLabel}
        </SubmitHelperTypography>
      </div>
    </>
  )

  return (
    <ItemContent providedStyles={themeProvider.essayItemContentStyles}>
      {itemTitle && (
        <MarkdownText
          Component={Typography}
          variant="h6"
          variantMapping={{ h6: "p" }}
        >
          {itemTitle}
        </MarkdownText>
      )}

      {itemBody && <MarkdownText variant="body1">{itemBody}</MarkdownText>}

      {quizDisabled ? (
        <AnswerField
          rowNumber={item.order}
          variant="outlined"
          fullWidth={true}
          multiline={true}
          rows={5}
          margin="normal"
          disabled
          providedStyles={themeProvider.answerFieldStyles}
        />
      ) : (
        answerPortion
      )}
    </ItemContent>
  )
}

export default Essay
