import React from "react"
import styled from "styled-components"
import { Button, TextField, MenuItem } from "@material-ui/core"
import { checkStore } from "../../services/tmcApi"
import usePromise from "react-use-promise"
import { fetchCourses } from "../../services/quizzes"
import { Course } from "../../types/Quiz"

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

interface CorrespondanceProps {
  course: Course
}

export const CorrespondanceModal = ({ course }: CorrespondanceProps) => {
  const userInfo = checkStore()

  const [courses, coursesError] = usePromise(() => fetchCourses(), [])

  let HOST = "http://localhost:3003"
  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes2.mooc.fi"
  }
  return (
    <>
      <StyledForm
        method="POST"
        action={HOST + `/api/v2/dashboard/courses/download-correspondance-file`}
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
              label="course"
              fullWidth
              variant="outlined"
              select
              name="courseId"
            >
              {courses?.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </StyledTextField>
          </InputContainer>
          <SubmitButtonWrapper>
            <SubmitButton type="submit" variant="outlined">
              Download the correspondance file
            </SubmitButton>
          </SubmitButtonWrapper>
        </InputWrapper>
      </StyledForm>
    </>
  )
}

export default CorrespondanceModal
