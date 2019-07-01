import * as React from "react"
import { Paper, TextField } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { wordCount } from "../../utils/string_tools"
import { executeIfTextFieldBetweenNumOfWords as executeIfWordNumberCorrect } from "../../utils/event_filters"
import { useTypedSelector } from "../../state/store"
import { QuizItem } from "../../state/quiz/reducer"
import { SpaciousPaper, SpaciousTypography } from "../styleComponents"
import { EssayLabels } from "../../utils/language_labels"

type EssayProps = {
  textData: string
  item: QuizItem
  handleTextDataChange: (e: React.FormEvent) => void
}

const Essay: React.FunctionComponent<EssayProps> = ({
  textData,
  handleTextDataChange,
  item,
}) => {
  const itemBody = item.texts[0].body
  const itemTitle = item.texts[0].title
  const quizAnswer = useTypedSelector(state => state.quizAnswer)
  const answered = quizAnswer.id
  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.essay,
  )

  const answerPortion = answered ? (
    <>
      <Typography variant="subtitle1">
        {languageInfo.userAnswerLabel + ": "}
      </Typography>
      <SpaciousPaper>
        <Typography variant="body1">{textData}</Typography>
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
