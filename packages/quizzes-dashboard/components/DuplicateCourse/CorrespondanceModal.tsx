import React, { useState } from "react"
import styled from "styled-components"
import { Button, TextField, MenuItem } from "@material-ui/core"
import usePromise from "react-use-promise"
import { fetchCourses, getCorrespondanceFile } from "../../services/quizzes"
import { Course } from "../../types/Quiz"

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

interface CorrespondanceProps {
  course: Course
}

export const CorrespondanceModal = ({ course }: CorrespondanceProps) => {
  const [courses, coursesError] = usePromise(() => fetchCourses(), [])

  const [courseId, setCourseId] = useState("")

  const downloadCorrespondaceFile = () => {
    getCorrespondanceFile(courseId, course.id)
    setCourseId("")
  }

  return (
    <>
      <InputWrapper>
        <InputContainer>
          <StyledTextField
            label="course"
            fullWidth
            variant="outlined"
            select
            name="courseId"
            onChange={event => setCourseId(event.target.value)}
          >
            {courses?.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </StyledTextField>
        </InputContainer>
        <SubmitButtonWrapper>
          <SubmitButton
            type="submit"
            variant="outlined"
            onClick={() => downloadCorrespondaceFile()}
          >
            Download the correspondance file
          </SubmitButton>
        </SubmitButtonWrapper>
      </InputWrapper>
    </>
  )
}

export default CorrespondanceModal
