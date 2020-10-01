import React, { useState } from "react"
import styled from "styled-components"
import { Button, TextField } from "@material-ui/core"
import usePromise from "react-use-promise"
import { fetchCourses, getCorrespondanceFile } from "../../services/quizzes"
import { Course } from "../../types/Quiz"
import { Autocomplete } from "@material-ui/lab"

const SubmitButton = styled(Button)`
  display: flex !important;
  background: #90caf9 !important;
`

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`

const SubmitButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
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
  interface CourseProps {
    getOptionLabel: (value: Course) => string
    onChange: (event: any, value: Course | null, reason: any) => void
  }

  const coursesProps: CourseProps = {
    getOptionLabel: course => course.title,
    onChange: (_event, value, _reason) => setCourseId(value ? value.id : ""),
  }

  if (coursesError) {
    return <>Something went wrong</>
  }

  return (
    <>
      <InputWrapper>
        {courses && (
          <>
            <Autocomplete
              options={courses}
              {...coursesProps}
              renderInput={params => (
                <StyledTextField
                  {...params}
                  label="Courses"
                  variant="outlined"
                  fullWidth
                  helperText="Tip: You can type part of course name in the field to sort out options"
                />
              )}
            />
            <SubmitButtonWrapper>
              <SubmitButton
                type="submit"
                variant="outlined"
                onClick={() => downloadCorrespondaceFile()}
              >
                Download the correspond file
              </SubmitButton>
            </SubmitButtonWrapper>
          </>
        )}
      </InputWrapper>
    </>
  )
}

export default CorrespondanceModal
