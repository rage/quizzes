import React from "react"
import { Item } from "../../types/EditQuiz"
import { Typography, TextField, Checkbox } from "@material-ui/core"
import styled from "styled-components"
import {
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMessage,
} from "../../store/edit/actions"
import { connect } from "react-redux"

interface contentBoxProps {
  item: Item
}

const Container = styled.div`
  display: flex;
  padding: 1rem;
`
const OpenContent = ({
  item,
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMessage,
}: any) => {
  return (
    <>
      <Container>
        <Typography variant="h6">
          ValidityRegex:{" "}
          <TextField
            defaultValue={item.validityRegex}
            onChange={event => editedValidityRegex(item.id, event.target.value)}
          />
        </Typography>
      </Container>
      <Container>
        <Typography variant="h6">
          Multi:{" "}
          <Checkbox
            defaultChecked={item.multi}
            onChange={event => toggledMultiOptions(item.id)}
          />
        </Typography>
      </Container>
      <Container>
        <Typography variant="h6">
          Success message:
          <TextField
            defaultValue={item.texts[0].successMessage}
            onChange={event =>
              editedItemMessage(item.id, event.target.value, true)
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
              editedItemMessage(item.id, event.target.value, false)
            }
          />
        </Typography>
      </Container>
    </>
  )
}

const mapDispatchToProps = {
  editedValidityRegex,
  toggledMultiOptions,
  editedItemMessage,
}

export default connect(null, mapDispatchToProps)(OpenContent)
