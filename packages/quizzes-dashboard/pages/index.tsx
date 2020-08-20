import React from "react"
import CourseList from "../components/CourseList"
import useSWR from "swr"
import { fetchCourses } from "../services/quizzes"
import useBreadcrumbs from "../hooks/useBreadcrumbs"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

const StyledTitleWrapper = styled.div`
  display: flex !important;
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
`

const Index = () => {
  const { data, error } = useSWR("null", fetchCourses)
  useBreadcrumbs([{ label: "Courses" }])
  return (
    <>
      <StyledTitleWrapper>
        <Typography variant="h2" component="h1">
          All courses
        </Typography>
      </StyledTitleWrapper>
      <CourseList data={data} error={error} />
    </>
  )
}

export default Index
