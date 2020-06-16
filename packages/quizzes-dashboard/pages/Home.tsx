import React from "react"
import { fetchCourses } from "../services/quizzes"
import Link from "next/link"
import { Typography, Card, CardContent } from "@material-ui/core"
import styled from "styled-components"
import DebugDialog from "../components/DebugDialog"
import { get } from "lodash"
import useSwr from "swr"

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
  if (error) {
    console.log(error)
    return <div>Something went wrong while fetching courses</div>
  }
  const courses = data
  return (
    <>
      <Typography variant="h3" component="h1">
        Courses
      </Typography>
      {courses ? (
        courses.map(course => (
          <Link
            key={course.id}
            href="/courses/[id]"
            as={`/courses/${course.id}`}
          >
            <CourseLink>
              <StyledCard key={course.id}>
                <CardContent>
                  {get(course, "texts[0].title") || course.id}
                </CardContent>
              </StyledCard>
            </CourseLink>
          </Link>
        ))
      ) : (
        <div>no courses</div>
      )}
      <DebugDialog />
    </>
  )
}

export default Home
