import React, { useState } from "react"
import { Item, Option } from "../../types/EditQuiz"
import styled from "styled-components"
import { Button, Typography, TextField } from "@material-ui/core"
import { editedOptionTitle } from "../../store/edit/actions"
import { connect } from "react-redux"

const QuizContent = styled.div`
  padding: 1rem;
`

interface contentBoxProps {
  item: Item
  saveOptionTitle: (newTitle: string, itemId: string, optionId: string) => any
}

const MultipleChoiceContent = ({ item, saveOptionTitle }: contentBoxProps) => {
  return (
    <>
      {item.options.map(option => (
        <MultipleChoiceButton
          key={option.id}
          option={option}
          itemId={item.id}
          saveOptionTitle={saveOptionTitle}
        />
      ))}
    </>
  )
}

interface multipleChoiceButtonProps {
  option: Option
  itemId: string
  saveOptionTitle: (newTitle: string, itemId: string, optionId: string) => any
}

const MultipleChoiceButton = ({
  option,
  itemId,
  saveOptionTitle,
}: multipleChoiceButtonProps) => {
  const [editOptionTitle, setEditOptionTitle] = useState(false)
  return (
    <QuizContent>
      <Button
        key={option.id}
        defaultValue={option.texts[0].title}
        variant="contained"
        disableRipple={editOptionTitle}
        onDoubleClick={() => setEditOptionTitle(!editOptionTitle)}
      >
        {editOptionTitle ? (
          <TextField
            defaultValue={option.texts[0].title}
            onChange={event =>
              saveOptionTitle(event.target.value, itemId, option.id)
            }
          />
        ) : (
          <Typography>{option.texts[0].title}</Typography>
        )}
      </Button>
    </QuizContent>
  )
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    saveOptionTitle: (newTitle: string, itemId: string, optionId: string) =>
      dispatch(editedOptionTitle(newTitle, itemId, optionId)),
  }
}

export default connect(null, mapDispatchToProps)(MultipleChoiceContent)
