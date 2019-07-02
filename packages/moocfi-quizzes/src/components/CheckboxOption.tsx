import * as React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { Checkbox, Grid, Typography } from "@material-ui/core"
import { useTypedSelector } from "../state/store"
import { QuizItem } from "../state/quiz/reducer"
import * as quizAnswerActions from "../state/quizAnswer/actions"

export type CheckboxOptionProps = {
  item: QuizItem
}

const VertCenteredGrid = styled(Grid)`
  align-self: center;
`

const CheckboxOption: React.FunctionComponent<CheckboxOptionProps> = ({
  item,
}) => {
  const dispatch = useDispatch()
  const handleCheckboxToggling = ((itemId: string) => (
    optionId: string,
  ) => () => dispatch(quizAnswerActions.changeCheckboxData(itemId, optionId)))(
    item.id,
  )

  const options = item.options
  const body = options[0].texts[0].body
  const title = options[0].texts[0].title
  const toggle = handleCheckboxToggling(options[0].id)

  const quizAnswer = useTypedSelector(state => state.quizAnswer)

  const answered = quizAnswer.id ? true : false

  const optionAnswers = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  ).optionAnswers
  const value = optionAnswers[0]

  const checkboxOptions = {
    disabled: answered,
    checked: value !== undefined,
  }

  return (
    <Grid container style={{ marginBottom: 10 }}>
      <Grid item xs={1}>
        <Checkbox
          value={value ? value.quizOptionId : ""}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
        />
      </Grid>
      <VertCenteredGrid item xs>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        {body && body !== title && (
          <Typography variant="body1">{body}</Typography>
        )}
      </VertCenteredGrid>
    </Grid>
  )
}

export default CheckboxOption
