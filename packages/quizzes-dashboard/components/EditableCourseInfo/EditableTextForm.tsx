import React, { useState } from "react"
import axios, { AxiosResponse } from "axios"
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
  width: 100%;
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

    let payload = {
      token: userInfo?.accessToken,
      ...(name === "title" && { title: fieldValue }),
      ...(name === "abbreviation" && { abbreviation: fieldValue }),
      ...(name === "moocfiid" && { moocfiId: fieldValue }),
    }

    const handleResponse = (response: AxiosResponse<any>) => {
      if (name === "title") {
        setFieldValue(response.data.title)
        setSavedValue(response.data.title)
      }
      if (name === "abbreviation") {
        setFieldValue(response.data.abbreviation)
        setSavedValue(response.data.abbreviation)
      }
      if (name === "moocfiid") {
        setFieldValue(response.data.moocfiId)
        setSavedValue(response.data.moocfiId)
      }
      success = true
    }

    await axios
      .post(formUrl, payload)
      .then(response => handleResponse(response))
      .catch(e => {
        setError(`Title ${fieldValue} is invalid`)
        return
      })

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
