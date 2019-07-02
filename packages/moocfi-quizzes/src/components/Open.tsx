import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { TextField, Typography, Paper } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { SpaciousTypography } from "./styleComponents"
import { SpaciousPaper } from "./styleComponents"

type OpenProps = {
  item: QuizItem
}

const SolutionPaper = styled(({ correct, ...other }) => (
  <SpaciousPaper {...other} />
))`
  border-left: 1rem solid ${props => (props.correct ? "green" : "red")};
`

const Open: React.FunctionComponent<OpenProps> = ({ item }) => {
  const dispatch = useDispatch()

  const handleTextDataChange = ((itemId: string) => (
    e: React.FormEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    dispatch(quizAnswerActions.changeTextData(itemId, e.currentTarget.value))
  })(item.id)

  const answer = useTypedSelector(state => state.quizAnswer)
  const itemAnswer = answer.itemAnswers.find(ia => ia.quizItemId === item.id)
  const correct = itemAnswer.correct
  const textData = itemAnswer.textData

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
