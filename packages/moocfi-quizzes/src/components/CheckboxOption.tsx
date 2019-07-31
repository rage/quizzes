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

const CheckboxOption: React.FunctionComponent<CheckboxOptionProps> = ({
  item,
}) => {
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)

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
  if (!itemAnswer) {
    return <LaterQuizItemAddition item={item} />
  }

  const optionAnswer = itemAnswer.optionAnswers[0]

  const checkboxOptions = {
    disabled: answerLocked,
    checked: optionAnswer !== undefined,
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        <Checkbox
          value={optionAnswer ? optionAnswer.quizOptionId : ""}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
        />
      </Grid>
      <VertCenteredGrid item xs>
        {title && (
          <MarkdownText Component={Typography} variant="subtitle1">
            {title}
          </MarkdownText>
        )}
        {body && body !== title && (
          <MarkdownText Component={Typography} variant="body1">
            {body}
          </MarkdownText>
        )}
      </VertCenteredGrid>
    </Grid>
  )
}

export default CheckboxOption
