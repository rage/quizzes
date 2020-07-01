import React, { useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Item, Option } from "../../../types/NormalizedQuiz"
import styled from "styled-components"
import {
  Button,
  TextField,
  Modal,
  Checkbox,
  FormControl,
  FormControlLabel,
  Fade,
  Box,
  Typography,
} from "@material-ui/core"
import {
  editedOptionTitle,
  editedOptionCorrectnes,
  editedOptionSuccessMessage,
  editedOptionFailureMessage,
} from "../../../store/editor/options/optionActions"
import { useDispatch } from "react-redux"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTypedSelector } from "../../../store/store"
import {
  editedItemSuccessMessage,
  editedItemFailureMessage,
  editedQuizItemTitle,
  editedSharedOptionsFeedbackMessage,
} from "../../../store/editor/items/itemAction"

const QuizContent = styled.div`
  padding: 1rem;
  display: flex;
`

const ItemInfo = styled.div`
  margin-botton: 1rem;
  margin-top: 1rem;
`

interface multiplChoiceContentProps {
  item: Item
}

const MultipleChoiceContent = ({ item }: multiplChoiceContentProps) => {
  const storeOptions = useTypedSelector(state => state.editor.options)
  const dispatch = useDispatch()
  return (
    <>
      <ItemInfo>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, item.id))
          }
        >
          {item.title}
        </TextField>
      </ItemInfo>
      {item.options.map(option => (
        <MultipleChoiceButton key={option} option={storeOptions[option]} />
      ))}
      <ItemInfo>
        <TextField
          multiline
          label="Success message"
          value={item.successMessage}
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedItemSuccessMessage(item.id, event.target.value))
          }
        />
      </ItemInfo>
      <ItemInfo>
        <TextField
          multiline
          label="Failure message"
          value={item.failureMessage}
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(editedItemFailureMessage(item.id, event.target.value))
          }
        />
      </ItemInfo>
      <ItemInfo>
        <TextField
          multiline
          label="Shared feedback message"
          value={item.sharedOptionFeedbackMessage}
          fullWidth
          variant="outlined"
          onChange={event =>
            dispatch(
              editedSharedOptionsFeedbackMessage(item.id, event.target.value),
            )
          }
        />
      </ItemInfo>
    </>
  )
}

interface multipleChoiceButtonProps {
  option: Option
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    Box: {
      backgroundColor: "#fafafa",
      minWidth: "700px",
      minHeight: "500px",
    },
  }),
)

const MultipleChoiceButton = ({ option }: multipleChoiceButtonProps) => {
  const classes = useStyles()
  const [editOption, setEditOption] = useState(false)
  const dispatch = useDispatch()

  return (
    <QuizContent>
      <Modal
        open={editOption}
        onClose={() => setEditOption(false)}
        className={classes.modal}
      >
        <Fade in={editOption}>
          <Box className={classes.Box}>
            <QuizContent>
              <Typography>Editing Option</Typography>
            </QuizContent>
            <QuizContent>
              <TextField
                label="Option Title"
                value={option.title}
                fullWidth
                variant="outlined"
                onChange={event =>
                  dispatch(editedOptionTitle(event.target.value, option.id))
                }
              />
            </QuizContent>
            <QuizContent>
              <TextField
                multiline
                label="Success message"
                value={option.successMessage}
                fullWidth
                variant="outlined"
                onChange={event =>
                  dispatch(
                    editedOptionSuccessMessage(option.id, event.target.value),
                  )
                }
              />
            </QuizContent>
            <QuizContent>
              <TextField
                multiline
                label="Failure message"
                value={option.failureMessage}
                fullWidth
                variant="outlined"
                onChange={event =>
                  dispatch(
                    editedOptionFailureMessage(option.id, event.target.value),
                  )
                }
              />
            </QuizContent>
            <QuizContent>
              <FormControl>
                <FormControlLabel
                  label="Correct"
                  labelPlacement="start"
                  control={
                    <Checkbox
                      color="primary"
                      checked={option.correct}
                      onChange={event =>
                        dispatch(
                          editedOptionCorrectnes(
                            option.id,
                            event.target.checked,
                          ),
                        )
                      }
                    />
                  }
                />
              </FormControl>
            </QuizContent>
          </Box>
        </Fade>
      </Modal>
      <Button
        fullWidth
        color={option.correct ? "primary" : "secondary"}
        onClick={() => setEditOption(true)}
        variant="outlined"
      >
        {option.title}
      </Button>
    </QuizContent>
  )
}

export default MultipleChoiceContent
