import React, { useState } from "react"
import styled from "styled-components"
import {
  Button,
  TextField,
  Snackbar,
  Typography,
  Fade,
} from "@material-ui/core"
import usePromise from "react-use-promise"
import { Course } from "../../types/Quiz"
import {
  duplicateCourse,
  getAllLanguages,
  getCorrespondenceFile,
} from "../../services/quizzes"
import { Alert, Autocomplete } from "@material-ui/lab"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #90caf9 !important;
  margin-top: 1rem !important;
`

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  width: 80%;
  justify-content: flex-end;
`

const StyledTextField = styled(TextField)`
  display: flex;
  width: 80% !important;
  margin-top: 1.5rem !important;
`

const MessageBox = styled.div<{ success: boolean }>`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 40%;
  border-style: solid;
  border-radius: 5px !important;
  border-width: 5px !important;
  border-color: ${props => {
    if (props.success) {
      return "#76ff03"
    } else {
      return "#ef5350"
    }
  }};
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
      getCorrespondenceFile(res.newCourseId, course.id)
      setTimeout(() => showResponse(false), 3000)
    } else {
      showResponse(true)
      setSuccess(false)
      setTimeout(() => showResponse(false), 3000)
    }
  }

  interface LangsProps {
    getOptionLabel: (value: { id: string; name: string }) => string
    onChange: (
      event: any,
      value: {
        id: string
        name: string
      } | null,
      reason: any,
    ) => void
  }

  const langsProps: LangsProps = {
    getOptionLabel: lang => lang.name,
    onChange: (_event, value, _reason) => setLang(value ? value.id : ""),
  }

  return (
    <>
      <Snackbar
        autoHideDuration={5000}
        open={response}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {success ? (
          <Alert severity="success">Course duplicated succesfully!</Alert>
        ) : (
          <Alert severity="error">Something went wrong!</Alert>
        )}
      </Snackbar>

      {langs && (
        <>
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
              <Autocomplete
                options={langs}
                {...langsProps}
                renderInput={params => (
                  <StyledTextField
                    {...params}
                    label="Languages"
                    variant="outlined"
                    fullWidth
                    helperText="Tip: You can type part of language in the field to sort out options"
                  />
                )}
              />
            </InputContainer>
            <SubmitButtonWrapper>
              <SubmitButton
                variant="outlined"
                onClick={() => handleCourseDuplication()}
              >
                Duplicate course
              </SubmitButton>
            </SubmitButtonWrapper>
            <Fade in={response}>
              <MessageBox success={success}>
                {success ? (
                  <Typography>Course duplicated succesfully!</Typography>
                ) : (
                  <Typography>Something went wrong!</Typography>
                )}
              </MessageBox>
            </Fade>
          </InputWrapper>
        </>
      )}
    </>
  )
}

export default DuplicateModal
