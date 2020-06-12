import React from "react"
import styled from "styled-components"
import { Typography, Card, CardContent } from "@material-ui/core"
import { fetchCourses } from "../services/quizzes"
import Link from "next/link"
import { get } from "lodash"
import { Course } from "../types/Course"
import DebugDialog from "../components/DebugDialog"

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

const Home = ({ courses }: HomeProps) => {
  return (
    <>
      <Typography variant="h3" component="h1">
        Quizzes
      </Typography>
      {courses.map((course) => (
        <Link key={course.id} href="/courses/[id]" as={`/courses/${course.id}`}>
          <CourseLink>
            <StyledCard key={course.id}>
              <CardContent>
                {get(course, "texts[0].title") || course.id}
              </CardContent>
            </StyledCard>
          </CourseLink>
        </Link>
      ))}
      <DebugDialog />
    </>
  )
}

const Container = styled.div`
  width: 960px;
  height: 100vh;
  margin: 2rem auto;
  padding: 2rem;
  background: ${(props) => props.theme.primary};
`

export default Home

Home.getInitialProps = async () => {
  const courses = await fetchCourses()
  return {
    courses,
  }
}
