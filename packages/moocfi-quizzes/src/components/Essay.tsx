import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../utils/string_tools"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { SpaciousPaper, SpaciousTypography } from "./styleComponents"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import { QuizItem, MiscEvent } from "../modelTypes"

type EssayProps = {
  item: QuizItem
}

const SubmitHelperTypography = styled(
  ({ attemptWasRecentlyMade, ...others }) => (
    <Typography
      color={attemptWasRecentlyMade ? "error" : "inherit"}
      {...others}
    />
  ),
)`
  font-style: ${({ attemptWasRecentlyMade }) =>
    attemptWasRecentlyMade ? "italic" : "inherit"};
`

const Essay: React.FunctionComponent<EssayProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

  const recentlyAttemptedDisabledSubmit = useTypedSelector(
    state => state.quizAnswer.attemptedDisabledSubmit,
  )

  if (!languageInfo) {
    return <div />
  }
  const essayLabels = languageInfo.essay
  const itemBody = item.texts[0].body
  const itemTitle = item.texts[0].title
  const answered = quizAnswer.id ? true : false

  let itemAnswer = quizAnswer.itemAnswers.find(ia => ia.quizItemId === item.id)

  if (!itemAnswer) {
    return <LaterQuizItemAddition item={item} />
  }

  const answerText = itemAnswer.textData || ""

  const numOfWords = wordCount(answerText)
  const answerWithinLimits =
    numOfWords >= (item.minWords || 0) &&
    numOfWords <= (item.maxWords || 666666)

  const answerPortion = answered ? (
    <>
      <Typography variant="subtitle1">
        {essayLabels.userAnswerLabel + ": "}
      </Typography>
      <SpaciousPaper>
        <Typography variant="body1">{answerText}</Typography>
      </SpaciousPaper>
    </>
  ) : (
    <>
      <Typography>
        {essayLabels.wordLimitsGuidance(item.minWords, item.maxWords)}
      </Typography>
      <TextField
        variant="outlined"
        label={essayLabels.textFieldLabel}
        value={answerText}
        onChange={handleTextDataChange}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
      />
      <div>
        <Typography>
          {essayLabels.currentNumberOfWordsLabel}: {numOfWords}
        </Typography>

        {!answerWithinLimits && (
          <SubmitHelperTypography
            attemptWasRecentlyMade={recentlyAttemptedDisabledSubmit}
          >
            {essayLabels.conformToLimitsToSubmitLabel}
          </SubmitHelperTypography>
        )}
      </div>
    </>
  )

  return (
    <div>
      <SpaciousTypography variant="h6">{itemTitle}</SpaciousTypography>
      <SpaciousTypography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: itemBody }}
      />
      {answerPortion}
    </div>
  )
}

export default Essay
