import React, { useState } from "react"
import { Item, Option } from "../../types/EditQuiz"
import styled from "styled-components"
import { Button, Typography, TextField } from "@material-ui/core"
import {
  editedOptionTitle,
  editedOptionCorrectnes,
} from "../../store/edit/actions"
import { useDispatch } from "react-redux"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const QuizContent = styled.div`
  padding: 1rem;
  display: flex;
`

interface multiplChoiceContentProps {
  item: Item
}

const MultipleChoiceContent = ({ item }: multiplChoiceContentProps) => {
  return (
    <>
      {item.options.map(option => (
        <MultipleChoiceButton
          key={option.id}
          option={option}
          itemId={item.id}
        />
      ))}
    </>
  )
}

interface multipleChoiceButtonProps {
  option: Option
  itemId: string
}

const MultipleChoiceButton = ({
  option,
  itemId,
}: multipleChoiceButtonProps) => {
  const [editOptionTitle, setEditOptionTitle] = useState(false)
  const dispatch = useDispatch()

  return (
    <QuizContent>
      <Button
        onClick={() => dispatch(editedOptionCorrectnes(itemId, option.id))}
      >
        <Typography>
          <FontAwesomeIcon icon={option.correct ? faCheck : faTimes} />
        </Typography>
      </Button>
      <Button
        key={option.id}
        defaultValue={option.texts[0].title}
        variant="contained"
        disableRipple={editOptionTitle}
        onDoubleClick={() => setEditOptionTitle(!editOptionTitle)}
        color={option.correct ? "primary" : "secondary"}
      >
        {editOptionTitle ? (
          <TextField
            defaultValue={option.texts[0].title}
            onChange={event =>
              dispatch(editedOptionTitle(event.target.value, itemId, option.id))
            }
          />
        ) : (
          <Typography>{option.texts[0].title}</Typography>
        )}
      </Button>
    </QuizContent>
  )
}

export default MultipleChoiceContent
