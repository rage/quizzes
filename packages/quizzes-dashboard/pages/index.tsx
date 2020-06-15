import React from "react"
import styled from "styled-components"
import { Typography, Card } from "@material-ui/core"
import { fetchCourses } from "../services/quizzes"
import { Course } from "../types/Course"
import DebugDialog from "../components/DebugDialog"
import useSwr from "swr"
import CourseList from "../components/CourseList"

interface HomeProps {
  courses: Course[]
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const CourseLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const Home = () => {
  const { data, error } = useSwr("null", fetchCourses)
  return (
    <>
      <Typography variant="h3" component="h1">
        Quizzes
      </Typography>
      <CourseList courses={data} error={error} />
      <DebugDialog />
    </>
  )
}

const Container = styled.div`
  width: 960px;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: ${props => props.theme.primary};
`

export default Home

// Home.getInitialProps = async () => {
//   const courses = await fetchCourses()
//   return {
//     courses,
//   }
// }
