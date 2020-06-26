import React, { useState } from "react"
import { Item, Option } from "../../types/NormalizedQuiz"
import styled from "styled-components"
import { Button, Typography, TextField } from "@material-ui/core"
import {
  editedOptionTitle,
  editedOptionCorrectnes,
} from "../../store/editor/options/optionActions"
import { useDispatch } from "react-redux"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTypedSelector } from "../../store/store"

const QuizContent = styled.div`
  padding: 1rem;
  display: flex;
`

interface multiplChoiceContentProps {
  item: Item
}

const MultipleChoiceContent = ({ item }: multiplChoiceContentProps) => {
  const storeOptions = useTypedSelector(state => state.editor.options)
  return (
    <>
      {item.options.map(option => (
        <MultipleChoiceButton key={option} option={storeOptions[option]} />
      ))}
    </>
  )
}

interface multipleChoiceButtonProps {
  option: Option
}

const MultipleChoiceButton = ({ option }: multipleChoiceButtonProps) => {
  const [editOptionTitle, setEditOptionTitle] = useState(false)
  const dispatch = useDispatch()

  return (
    <QuizContent>
      <Button onClick={() => dispatch(editedOptionCorrectnes(option.id))}>
        <Typography>
          <FontAwesomeIcon icon={option.correct ? faCheck : faTimes} />
        </Typography>
      </Button>
      <Button
        key={option.id}
        defaultValue={option.title}
        variant="contained"
        disableRipple={editOptionTitle}
        onDoubleClick={() => setEditOptionTitle(!editOptionTitle)}
        color={option.correct ? "primary" : "secondary"}
      >
        {editOptionTitle ? (
          <TextField
            defaultValue={option.title}
            onChange={event =>
              dispatch(editedOptionTitle(event.target.value, option.id))
            }
          />
        ) : (
          <Typography>{option.title}</Typography>
        )}
      </Button>
    </QuizContent>
  )
}

export default MultipleChoiceContent
