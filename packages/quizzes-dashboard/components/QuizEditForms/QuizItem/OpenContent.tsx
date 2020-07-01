import React, { useState } from "react"
import { Item } from "../../../types/NormalizedQuiz"
import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
  makeStyles,
  createStyles,
  Modal,
  Box,
  Typography,
} from "@material-ui/core"
import styled from "styled-components"
import {
  editedValidityRegex,
  toggledMultiOptions,
  editedQuizItemTitle,
  editedQuizItemBody,
  editedItemSuccessMessage,
  editedItemFailureMessage,
} from "../../../store/editor/items/itemAction"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../../store/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faTimesCircle,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons"
interface openContentProps {
  item: Item
}

const ItemInfo = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
`

const ModalItem = styled.div`
  padding: 1rem;
`

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    Box: {
      backgroundColor: "#fafafa",
      minWidth: "300px",
      minHeight: "300px",
    },
  }),
)
const OpenContent = ({ item }: openContentProps) => {
  const storeItem = useTypedSelector(state => state.editor.items[item.id])
  const dispatch = useDispatch()
  const [test, setTest] = useState(false)
  const [testAnswer, setTestAnswer] = useState("")
  const classes = useStyles()
  return (
    <>
      <ItemInfo>
        <TextField
          fullWidth
          variant="outlined"
          label="title"
          onChange={event =>
            dispatch(editedQuizItemTitle(event.target.value, storeItem.id))
          }
        >
          {storeItem.title}
        </TextField>
      </ItemInfo>
      <ItemInfo>
        <TextField
          fullWidth
          variant="outlined"
          label="Body"
          onChange={event =>
            dispatch(editedQuizItemBody(event.target.value, storeItem.id))
          }
        >
          {storeItem.body}
        </TextField>
      </ItemInfo>
      <ItemInfo>
        <TextField
          label="Validity regex"
          fullWidth
          variant="outlined"
          value={storeItem.validityRegex}
          onChange={event =>
            dispatch(editedValidityRegex(storeItem.id, event.target.value))
          }
        />
        <Button variant="outlined" onClick={() => setTest(true)}>
          Test validity regex
        </Button>
      </ItemInfo>
      <FormControl>
        <FormControlLabel
          label="Multi"
          labelPlacement="start"
          control={
            <Checkbox
              color="primary"
              checked={storeItem.multi}
              onChange={event =>
                dispatch(
                  toggledMultiOptions(storeItem.id, event.target.checked),
                )
              }
            />
          }
        />
      </FormControl>
      <ItemInfo>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          label="Success message"
          defaultValue={storeItem.successMessage}
          onChange={event =>
            dispatch(editedItemSuccessMessage(storeItem.id, event.target.value))
          }
        />
      </ItemInfo>
      <ItemInfo>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          label="Failure message"
          defaultValue={storeItem.failureMessage}
          onChange={event =>
            dispatch(editedItemFailureMessage(storeItem.id, event.target.value))
          }
        />
      </ItemInfo>
      <Modal
        open={test}
        onClose={() => setTest(false)}
        className={classes.modal}
      >
        <Box className={classes.Box}>
          <ModalItem>
            <Typography>Regex tester</Typography>
          </ModalItem>
          <ModalItem>
            <TextField
              fullWidth
              multiline
              variant="outlined"
              label="Validity Regex"
              value={storeItem.validityRegex}
              onChange={event =>
                dispatch(editedValidityRegex(storeItem.id, event.target.value))
              }
            >
              Regex: {storeItem.validityRegex}
            </TextField>
          </ModalItem>
          <ModalItem>
            <TextField
              label="test"
              fullWidth
              multiline
              variant="outlined"
              onChange={event => setTestAnswer(event.target.value)}
            />
          </ModalItem>
          {storeItem.validityRegex ? (
            <>
              <ModalItem>
                {testAnswer.match(storeItem.validityRegex) ? (
                  <>
                    <ModalItem>
                      <FontAwesomeIcon icon={faCheck} color="green" />
                      <Typography>Given test matches regex</Typography>
                    </ModalItem>
                  </>
                ) : (
                  <>
                    <ModalItem>
                      <FontAwesomeIcon icon={faTimesCircle} color="red" />
                      <Typography>Given test doesn't match regex</Typography>
                    </ModalItem>
                  </>
                )}
              </ModalItem>
            </>
          ) : (
            <>
              <ModalItem>
                <FontAwesomeIcon icon={faQuestion} color="blue" />
                <Typography>Validty regex not provided</Typography>
              </ModalItem>
            </>
          )}
        </Box>
      </Modal>
    </>
  )
}
export default OpenContent
