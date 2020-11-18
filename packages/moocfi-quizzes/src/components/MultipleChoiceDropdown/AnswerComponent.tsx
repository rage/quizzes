import React from "react"
import styled from "styled-components"
import { InputLabel, MenuItem, Select } from "@material-ui/core"
import { QuizItemOption } from "../../modelTypes"
import { useDispatch } from "react-redux"
import * as quizAnswerActions from "../../state/quizAnswer/actions"

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
  const handleOptionChange = (optionId: string) => () =>
    dispatch(quizAnswerActions.changeChosenOption(quizItemId, optionId))
  const [selectedOption, setSelectedOption] = React.useState("")
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string)
  }

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
                onClick={() => {
                  handleOptionChange(option.id)
                }}
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
