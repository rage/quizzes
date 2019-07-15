import * as React from "react"
import { useDispatch } from "react-redux"
import { TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../utils/string_tools"
import { executeIfTextFieldBetweenNumOfWords as executeIfWordNumberCorrect } from "../utils/event_filters"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { SpaciousPaper, SpaciousTypography } from "./styleComponents"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import { QuizItem, MiscEvent } from "../modelTypes"

type EssayProps = {
  item: QuizItem
}

const Essay: React.FunctionComponent<EssayProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const languageInfo = useTypedSelector(state => state.language.languageLabels)

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
      {item.minWords && (
        <Typography variant="body1">
          {essayLabels.minimumWords}: {item.minWords}
        </Typography>
      )}
      <TextField
        variant="outlined"
        label={essayLabels.textFieldLabel}
        value={answerText}
        onChange={executeIfWordNumberCorrect(
          handleTextDataChange,
          answerText,
          item.maxWords,
        )}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
      />
      <div>
        {essayLabels.currentNumberOfWordsLabel}: {wordCount(answerText)}
        {item.maxWords && <> / {item.maxWords}</>}
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
