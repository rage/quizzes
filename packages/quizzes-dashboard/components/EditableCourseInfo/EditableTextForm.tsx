import React, { useState } from "react"
import axios from "axios"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons"
import {
  ClickAwayListener,
  Button,
  InputLabel,
  Snackbar,
} from "@material-ui/core"
import styled from "styled-components"
import { checkStore } from "../../services/tmcApi"
import { Alert } from "@material-ui/lab"

const StyledTextField = styled(TextField)`
  font-weight: bold;
  font-size: 2rem;
`
const StyledButton = styled(Button)`
  margin: "0.5rem";
`

const FieldWrapper = styled.div`
  margin-bottom: 0.75rem;

  > label:first-letter {
    text-transform: capitalize;
  }
`

const EditableTextForm = ({
  formUrl,
  name,
  value,
  label,
}: {
  formUrl: string
  name: string
  value: string
  label: string
}) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [mouseOver, setMouseOver] = useState<boolean>(false)
  const [fieldValue, setFieldValue] = useState<string>(value || "-")
  const [savedValue, setSavedValue] = useState(value)
  const [saved, setSaved] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const userInfo = checkStore()

  const handleChange = (event: React.SyntheticEvent): void => {
    const element = event.target as HTMLInputElement
    setFieldValue(element.value)
  }

  const handleMouseOver = (): void => {
    if (!mouseOver) {
      setMouseOver(true)
    }
  }

  const handleMouseOut = (): void => {
    if (mouseOver) {
      setMouseOver(false)
    }
  }

  const handleClickAway = (): void => {
    // return field to last saved state
    setEditMode(false)
    setFieldValue(savedValue)
  }

  const handleClick = (): void => {
    setEditMode(true)
    setMouseOver(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false

    if (fieldValue.length <= 3) {
      setError(`Ensure the input is over 3 characters long`)
      return
    }

    switch (name) {
      case "title":
        await axios
          .post(formUrl, {
            token: userInfo?.accessToken,
            title: fieldValue,
          })
          .then(response => {
            setFieldValue(response.data.title)
            setSavedValue(response.data.title)
            success = true
          })
          .catch(error => {
            setError(`Title ${fieldValue} is invalid`)
            return
          })
        break
      case "abbreviation":
        await axios
          .post(formUrl, {
            token: userInfo?.accessToken,
            abbreviation: fieldValue,
          })
          .then(response => {
            setFieldValue(response.data.abbreviation)
            setSavedValue(response.data.title)
            success = true
          })
          .catch(error => {
            setError(`Abbreviation ${fieldValue} is invalid`)
            return
          })
        break
      case "moocfiid":
        await axios
          .post(formUrl, {
            token: userInfo?.accessToken,
            moocfiId: fieldValue,
          })
          .then(response => {
            setFieldValue(response.data.moocfiId)
            setSavedValue(response.data.title)
            success = true
          })
          .catch(error => {
            setError(
              `${fieldValue} has invalid format. Please use a valid moocfi_id`,
            )
            return
          })
        break
      default:
        break
    }

    if (success && !error) {
      setSaved(true)
    }
  }

  return (
    <>
      <Snackbar
        open={saved}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSaved(false)}
      >
        <Alert onClose={() => setSaved(false)} severity="success">
          {label} successfully changed!
        </Alert>
      </Snackbar>
      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <form onSubmit={e => handleSubmit(e)}>
        <input
          value={userInfo?.accessToken}
          type="hidden"
          name="token"
          id="token"
        />
        <ClickAwayListener onClickAway={handleClickAway}>
          <FieldWrapper>
            <InputLabel htmlFor={name}>
              <strong>{label}</strong>{" "}
            </InputLabel>{" "}
            <StyledTextField
              id={name}
              name={name}
              value={fieldValue}
              error={fieldValue?.length < 3}
              onChange={handleChange}
              disabled={!editMode}
              onMouseEnter={handleMouseOver}
              onMouseLeave={handleMouseOut}
              // fullWidth="true"
              variant={editMode ? "outlined" : "standard"}
              InputProps={{
                disableUnderline: true,
                endAdornment:
                  mouseOver && !editMode ? (
                    <>
                      <InputAdornment position="end">
                        <IconButton onClick={handleClick}>
                          <FontAwesomeIcon icon={faEdit} />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ) : (
                    editMode && (
                      <InputAdornment position="end">
                        <StyledButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={
                            <FontAwesomeIcon icon={faSave} size="xs" />
                          }
                        >
                          Save
                        </StyledButton>
                      </InputAdornment>
                    )
                  ),
              }}
            />
          </FieldWrapper>
        </ClickAwayListener>
      </form>
    </>
  )
}

export default EditableTextForm
