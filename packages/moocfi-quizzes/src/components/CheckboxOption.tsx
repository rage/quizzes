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

const CheckboxRowTextContainer = styled.div`
  align-self: center;
  flex: 1;
  position: relative;
  top: 1px;
`

const CheckboxRowContainer = styled.div`
  display: flex;
`

const MarkdownTextWithoutMargin = styled(MarkdownText)`
  p {
    margin: 0;
  }
`

// Checkboxes used to have options but it made no sense since we always rendered
// only the first option anyway. New checkboxes can no longer have any options
// so this component should be refactored to not depend on options.
const CheckboxOption: React.FunctionComponent<CheckboxOptionProps> = ({
  item,
}) => {
  const quizAnswer = useTypedSelector(state => state.quizAnswer.quizAnswer)
  const userQuizState = useTypedSelector(state => state.user.userQuizState)
  const quizDisabled = useTypedSelector(state => state.quizAnswer.quizDisabled)

  const dispatch = useDispatch()
  const option = item.options[0]

  let body
  let title

  if (option) {
    body = option.body
    title = option.title
  } else {
    body = item.body
    title = item.title
  }

  const answerLocked =
    userQuizState && userQuizState.status === "locked" ? true : false

  const toggle = () => {
    if (answerLocked) {
      return
    }
    dispatch(quizAnswerActions.changeCheckboxData(item.id, option?.id))
  }

  const itemAnswer = quizAnswer.itemAnswers.find(
    ia => ia.quizItemId === item.id,
  )
  if (!itemAnswer && !quizDisabled) {
    return <LaterQuizItemAddition item={item} />
  }

  const optionAnswer = itemAnswer && itemAnswer.optionAnswers[0]
  let answer = optionAnswer?.quizOptionId !== undefined
  if (!answer) {
    answer = itemAnswer?.intData === 1
  }
  const checkboxOptions = {
    disabled: answerLocked || quizDisabled,
    checked: answer && !quizDisabled,
  }

  return (
    <CheckboxRowContainer>
      <div>
        <Checkbox
          value={answer}
          color="primary"
          onChange={toggle}
          {...checkboxOptions}
          inputProps={{ "aria-label": `${title}` }}
        />
      </div>
      <CheckboxRowTextContainer onClick={toggle}>
        {title && (
          <MarkdownTextWithoutMargin
            Component={Typography}
            variant="subtitle1"
            variantMapping={{ subtitle1: "p" }}
          >
            {title}
          </MarkdownTextWithoutMargin>
        )}
        {body && body !== title && (
          <MarkdownTextWithoutMargin Component={Typography} variant="body1">
            {body}
          </MarkdownTextWithoutMargin>
        )}
      </CheckboxRowTextContainer>
    </CheckboxRowContainer>
  )
}

export default CheckboxOption
