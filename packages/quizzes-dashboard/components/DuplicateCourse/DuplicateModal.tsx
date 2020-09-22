import React, { useState } from "react"
import styled from "styled-components"
import { Button, TextField, MenuItem, Snackbar } from "@material-ui/core"
import usePromise from "react-use-promise"
import { Course } from "../../types/Quiz"
import {
  duplicateCourse,
  getAllLanguages,
  getCorrespondanceFile,
} from "../../services/quizzes"
import { Alert } from "@material-ui/lab"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #90caf9 !important;
`

const InputWrapper = styled.div`
  display: flex;
  width: 75%;
  justify-content: space-around;
  flex-wrap: wrap;
`

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 1.5rem;
`

const StyledTextField = styled(TextField)`
  display: flex;
  margin-top: 1.5rem !important;
`

interface DuplicateModalProps {
  course: Course
}

export const DuplicateModal = ({ course }: DuplicateModalProps) => {
  const [langs, langsError] = usePromise(() => getAllLanguages(), [])
  const [name, setName] = useState("")
  const [abbr, setAbbr] = useState("")
  const [lang, setLang] = useState(course.languageId)
  const [response, showResponse] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCourseDuplication = async () => {
    const res = await duplicateCourse(course.id, name, abbr, lang)

    if (res.success) {
      showResponse(true)
      setSuccess(true)
      getCorrespondanceFile(res.newCourseId, course.id)
    } else {
      showResponse(true)
      setSuccess(false)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={5000}
        open={response}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {success ? (
          <Alert severity="success">Course duplicated succesfully!</Alert>
        ) : (
          <Alert severity="error">Something went wrong!</Alert>
        )}
      </Snackbar>

      <InputWrapper>
        <InputContainer>
          <StyledTextField
            label="Name"
            fullWidth
            variant="outlined"
            inputMode="text"
            name="name"
            onChange={event => {
              setName(event.target.value)
            }}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            label="Abbreviation"
            fullWidth
            variant="outlined"
            inputMode="text"
            name="abbr"
            onChange={event => setAbbr(event.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <StyledTextField
            label="language"
            fullWidth
            variant="outlined"
            select
            name="lang"
            value={lang}
            onChange={event => setLang(event.target.value)}
          >
            {langs?.map(lan => {
              return (
                <MenuItem key={lan.id} value={lan.id}>
                  {lan.name}
                </MenuItem>
              )
            })}
          </StyledTextField>
        </InputContainer>
        <SubmitButtonWrapper>
          <SubmitButton
            variant="outlined"
            onClick={() => handleCourseDuplication()}
          >
            Duplicate course
          </SubmitButton>
        </SubmitButtonWrapper>
      </InputWrapper>
    </>
  )
}

export default DuplicateModal
