import React, { useState } from "react"
import { Item, Option } from "../../types/EditQuiz"
import styled from "styled-components"
import { Button, Typography, TextField } from "@material-ui/core"
import {
  editedOptionTitle,
  editedOptionCorrectnes,
} from "../../store/edit/actions"
import { connect } from "react-redux"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EditorState } from "../../store/edit/reducers"

const QuizContent = styled.div`
  padding: 1rem;
  display: flex;
`

interface contentBoxProps {
  item: Item
  saveOptionTitle: (newTitle: string, itemId: string, optionId: string) => any
  editOptionCorrectnes: (itemId: string, optionId: string) => any
}

const MultipleChoiceContent = ({
  item,
  saveOptionTitle,
  editOptionCorrectnes,
}: contentBoxProps) => {
  return (
    <>
      {item.options.map((option) => (
        <MultipleChoiceButton
          key={option.id}
          option={option}
          itemId={item.id}
          saveOptionTitle={saveOptionTitle}
          editOptionCorrectnes={editOptionCorrectnes}
        />
      ))}
    </>
  )
}

interface multipleChoiceButtonProps {
  option: Option
  itemId: string
  saveOptionTitle: (newTitle: string, itemId: string, optionId: string) => any
  editOptionCorrectnes: (itemId: string, optionId: string) => any
}

const MultipleChoiceButton = ({
  option,
  itemId,
  saveOptionTitle,
  editOptionCorrectnes,
}: multipleChoiceButtonProps) => {
  const [editOptionTitle, setEditOptionTitle] = useState(false)
  return (
    <QuizContent>
      <Button onClick={() => editOptionCorrectnes(itemId, option.id)}>
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
            onChange={(event) =>
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

    editOptionCorrectnes: (itemId: string, optionId: string) =>
      dispatch(editedOptionCorrectnes(itemId, optionId)),
  }
}

const mapStateToProps = (state: EditorState) => {
  return {
    items: state.items,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MultipleChoiceContent)
