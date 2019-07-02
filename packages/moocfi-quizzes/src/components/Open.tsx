import * as React from "react"
import styled from "styled-components"
import { TextField, Typography, Paper } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"
import { SpaciousTypography } from "./styleComponents"
import { SpaciousPaper } from "./styleComponents"

type OpenProps = {
  correct: boolean
  handleTextDataChange: (e: React.FormEvent) => void
  textData: string
  item: QuizItem
}

const SolutionPaper = styled(({ correct, ...other }) => (
  <SpaciousPaper {...other} />
))`
  border-left: 1rem solid ${props => (props.correct ? "green" : "red")};
`

const Open: React.FunctionComponent<OpenProps> = ({
  correct,
  handleTextDataChange,
  textData,
  item,
}) => {
  const answer = useTypedSelector(state => state.quizAnswer)
  const languageInfo = useTypedSelector(
    state => state.language.languageLabels.open,
  )
  const answered = answer.id ? true : false
  const itemTitle = item.texts[0].title
  const successMessage = item.texts[0].successMessage
  const failureMessage = item.texts[0].failureMessage

  const guidance = (
    <>
      <SpaciousTypography variant="h6">{itemTitle}</SpaciousTypography>
      <SpaciousTypography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: item.texts[0].body }}
      />
    </>
  )

  if (answered) {
    return (
      <div>
        {guidance}
        <Typography variant="subtitle1">
          {languageInfo.userAnswerLabel}:
        </Typography>
        <SpaciousPaper>
          <Typography variant="body1">{textData}</Typography>
        </SpaciousPaper>
        <SolutionPaper correct={correct}>
          <Typography variant="body1">
            {correct ? successMessage : failureMessage}
          </Typography>
        </SolutionPaper>
      </div>
    )
  }

  return (
    <div>
      {guidance}
      <TextField
        value={textData}
        onChange={handleTextDataChange}
        fullWidth
        margin="normal"
        placeholder={languageInfo.placeholder}
      />
    </div>
  )
}

export default Open
