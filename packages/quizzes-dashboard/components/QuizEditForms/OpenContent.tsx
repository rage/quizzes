import React from "react"
import { Item } from "../../types/EditQuiz"
import { Typography, TextField, Checkbox } from "@material-ui/core"
import styled from "styled-components"
import {
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMessage,
} from "../../store/edit/editActions"
import { useDispatch } from "react-redux"

interface openContentProps {
  item: Item
}

const Container = styled.div`
  display: flex;
  padding: 1rem;
`
const OpenContent = ({ item }: openContentProps) => {
  const dispatch = useDispatch()
  return (
    <>
      <Container>
        <Typography variant="h6">
          ValidityRegex:
          <TextField
            defaultValue={item.validityRegex}
            onChange={event =>
              dispatch(editedValidityRegex(item.id, event.target.value))
            }
          />
        </Typography>
      </Container>
      <Container>
        <Typography variant="h6">
          Multi:
          <Checkbox
            checked={item.multi}
            onChange={() => dispatch(toggledMultiOptions(item.id))}
          />
        </Typography>
      </Container>
      <Container>
        <Typography variant="h6">
          Success message:
          <TextField
            defaultValue={item.texts[0].successMessage}
            onChange={event =>
              dispatch(editedItemMessage(item.id, event.target.value, true))
            }
          />
        </Typography>
      </Container>
      <Container>
        <Typography variant="h6">
          Failure message:
          <TextField
            defaultValue={item.texts[0].failureMessage}
            onChange={event =>
              dispatch(editedItemMessage(item.id, event.target.value, false))
            }
          />
        </Typography>
      </Container>
    </>
  )
}
export default OpenContent
