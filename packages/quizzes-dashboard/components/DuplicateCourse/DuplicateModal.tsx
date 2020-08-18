import React from "react"
import styled from "styled-components"
import { Button, TextField, MenuItem } from "@material-ui/core"
import { checkStore } from "../../services/tmcApi"
import usePromise from "react-use-promise"
import { Course } from "../../types/Quiz"
import { getAllLanguages } from "../../services/quizzes"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #90caf9 !important;
`

const StyledForm = styled.form`
  display: flex !important;
  justify-content: center;
  width: 100% !important;
  flex-wrap: wrap;
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
  const userInfo = checkStore()
  const [langs, langsError] = usePromise(() => getAllLanguages(), [])

  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes.mooc.fi"
  }

  return (
    <>
      <StyledForm
        method="POST"
        action={
          HOST + `/api/v2/dashboard/courses/${course.id}/duplicate-course`
        }
      >
        <InputWrapper>
          <input
            value={userInfo?.accessToken}
            type="hidden"
            name="token"
            id="token"
          />
          <input value={course.id} type="hidden" name="oldCourseId" />
          <InputContainer>
            <StyledTextField
              label="Name"
              fullWidth
              variant="outlined"
              inputMode="text"
              name="name"
            />
          </InputContainer>
          <InputContainer>
            <StyledTextField
              label="Abbreviation"
              fullWidth
              variant="outlined"
              inputMode="text"
              name="abbr"
            />
          </InputContainer>
          <InputContainer>
            <StyledTextField
              label="language"
              fullWidth
              variant="outlined"
              select
              name="lang"
              value={course.languageId}
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
            <SubmitButton type="submit" variant="outlined">
              Duplicate course
            </SubmitButton>
          </SubmitButtonWrapper>
        </InputWrapper>
      </StyledForm>
    </>
  )
}

export default DuplicateModal
