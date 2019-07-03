import * as React from "react"
import { useDispatch } from "react-redux"
import { TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../../utils/string_tools"
import { executeIfTextFieldBetweenNumOfWords as executeIfWordNumberCorrect } from "../../utils/event_filters"
import { useTypedSelector } from "../../state/store"
import * as quizAnswerActions from "../../state/quizAnswer/actions"
import { SpaciousPaper, SpaciousTypography } from "../styleComponents"
import { QuizItem, MiscEvent } from "../../modelTypes"

type EssayProps = {
  item: QuizItem
}

const Essay: React.FunctionComponent<EssayProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleTextDataChange = (e: MiscEvent) =>
    dispatch(quizAnswerActions.changeTextData(item.id, e.currentTarget.value))

  const quizAnswer = useTypedSelector(state => state.quizAnswer)
  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.essay,
  )

  const itemBody = item.texts[0].body
  const itemTitle = item.texts[0].title
  const answered = quizAnswer.id ? true : false

  const answerText = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  ).textData

  const answerPortion = answered ? (
    <>
      <Typography variant="subtitle1">
        {languageInfo.userAnswerLabel + ": "}
      </Typography>
      <SpaciousPaper>
        <Typography variant="body1">{answerText}</Typography>
      </SpaciousPaper>
    </>
  ) : (
    <>
      {item.minWords && (
        <Typography variant="body1">
          {languageInfo.minimumWords}: {item.minWords}
        </Typography>
      )}
      <TextField
        variant="outlined"
        label={languageInfo.textFieldLabel}
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
        {languageInfo.currentNumberOfWordsLabel}: {wordCount(answerText)}
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
