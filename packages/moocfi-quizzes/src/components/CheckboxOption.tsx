import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Checkbox, Grid, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import * as quizAnswerActions from "../state/quizAnswer/actions"
import { QuizItem } from "../modelTypes"
import LaterQuizItemAddition from "./LaterQuizItemAddition"
import MarkdownText from "./MarkdownText"

export type CheckboxOptionProps = {
  item: QuizItem
}

const VertCenteredGrid = styled(Grid)`
  align-self: center;
`

const MarkdownTextWithoutMargin = styled(MarkdownText)`
  p {
    margin: 0;
  }
`

const CheckboxOption: React.FunctionComponent<CheckboxOptionProps> = ({
  item,
}) => {
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const dispatch = useDispatch()
  const option = item.options[0]
  const { body, title } = option.texts[0]

  const toggle = () =>
    dispatch(quizAnswerActions.changeCheckboxData(item.id, option.id))

  const answerLocked =
    userQuizState && userQuizState.status === "locked" ? true : false

  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )
  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const optionAnswer = itemAnswer && itemAnswer.optionAnswers[0]

  const checkboxOptions = {
    disabled: answerLocked || quizDisabled,
    checked: optionAnswer !== undefined && !quizDisabled,
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        <Checkbox
          value={optionAnswer ? optionAnswer.quizOptionId : ""}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
          inputProps={{'aria-label':`${title}`}}
        />
      </Grid>
      <VertCenteredGrid item xs>
        {title && (
          <MarkdownTextWithoutMargin
            component="p"
            Component={Typography}
            variant="subtitle1"
          >
            {title}
          </MarkdownTextWithoutMargin>
        )}
        {body && body !== title && (
          <MarkdownTextWithoutMargin Component={Typography} variant="body1">
            {body}
          </MarkdownTextWithoutMargin>
        )}
      </VertCenteredGrid>
    </Grid>
  )
}

export default CheckboxOption
