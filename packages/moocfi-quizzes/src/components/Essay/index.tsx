import * as React from "react"
import { Paper, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../../utils/string_tools"
import { executeIfTextFieldBetweenNumOfWords as executeIfWordNumberCorrect } from "../../utils/event_filters"
import { useTypedSelector } from "../../state/store"
import { QuizItem } from "../../state/quiz/reducer"

type EssayProps = {
  textData: string
  item: QuizItem
  handleTextDataChange: (a: any) => any
  languageInfo: any
}

const Essay: React.FunctionComponent<EssayProps> = ({
  textData,
  handleTextDataChange,
  item,
  languageInfo,
}) => {
  const paper = {
    padding: 10,
    margin: 10,
  }

  const itemBody = item.texts[0].body
  const itemTitle = item.texts[0].title
  const quizAnswer = useTypedSelector(state => state.quizAnswer)
  const answered = quizAnswer.id

  const answerPortion = answered ? (
    <>
      <Typography variant="subtitle1">
        {languageInfo.userAnswerLabel + ": "}
      </Typography>
      <Paper style={paper}>
        <Typography variant="body1">{textData}</Typography>
      </Paper>
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
        label="Vastauksesi"
        value={textData}
        onChange={executeIfWordNumberCorrect(
          handleTextDataChange,
          textData,
          item.maxWords,
        )}
        fullWidth={true}
        multiline={true}
        rows={10}
        margin="normal"
      />
      <div>
        Sanoja: {wordCount(textData)}
        {item.maxWords && <> / {item.maxWords}</>}
      </div>
    </>
  )

  return (
    <div>
      <Typography variant="h6" style={{ paddingBottom: 10 }}>
        {itemTitle}
      </Typography>
      <Typography
        variant="body1"
        style={{ paddingBottom: 10 }}
        dangerouslySetInnerHTML={{ __html: itemBody }}
      />

      {answerPortion}
    </div>
  )
}

export default Essay
