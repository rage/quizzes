import React from "react"
import styled from "styled-components"
import { InputLabel, MenuItem, Select } from "@material-ui/core"
import { QuizItemOption } from "../../modelTypes"
import { useDispatch } from "react-redux"
import * as quizAnswerActions from "../../state/quizAnswer/actions"
import { useTypedSelector } from "../../state/store"

interface ChoicesContainerProps {
  direction: string
  providedStyles: string | undefined
}

const StyledSelect = styled(Select)<ChoicesContainerProps>``

interface Props {
  direction: string
  themeProvider: any
  options: QuizItemOption[]
  quizDisabled: boolean
  quizItemId: string
}

const AnswerComponent = ({
  direction,
  themeProvider,
  options,
  quizDisabled,
  quizItemId,
}: Props) => {
  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const optionId = event.target.value as string
    dispatch(quizAnswerActions.changeChosenOption(quizItemId, optionId))
  }

  const quizItemAnswer = useTypedSelector(state =>
    state.quizAnswer.quizAnswer.itemAnswers.find(ia => ia.id === quizItemId),
  )

  const selectedOptionIds =
    quizItemAnswer?.optionAnswers.map(oA => oA.quizOptionId) || []

  // This does not support selecting multiple options at the moment.
  const selectedOption = selectedOptionIds[0]

  return (
    <>
      <InputLabel id="demo-simple-select-outlined-label">
        select an option
      </InputLabel>
      <StyledSelect
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-filled"
        direction={direction}
        value={selectedOption}
        providedStyles={themeProvider.optionContainerStyles}
        onChange={handleChange}
      >
        {options
          .sort((o1, o2) => o1.order - o2.order)
          .map((option, index) => {
            const optionIsSelected = option.id === selectedOption
            return (
              <MenuItem
                selected={!!optionIsSelected}
                disabled={quizDisabled}
                aria-pressed={optionIsSelected}
                key={option.id}
                value={option.id}
              >
                {option.title}
              </MenuItem>
            )
          })}
      </StyledSelect>
    </>
  )
}

export default AnswerComponent
