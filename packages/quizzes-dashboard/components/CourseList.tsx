import React from "react"
import styled from "styled-components"
import { Card, CardContent } from "@material-ui/core"
import Link from "next/link"
import Skeleton from "@material-ui/lab/Skeleton"
import useSWR from "swr"
import { fetchCourses } from "../services/quizzes"

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const CourseLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const StyledSkeleton = styled(Skeleton)`
  margin-bottom: 1rem;
`

const CourseList = () => {
  const { data, error } = useSWR("null", fetchCourses)
  if (error) {
    return <div>Error while fetching courses.</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
        <StyledSkeleton variant="rect" height={50} />
      </>
    )
  }
  return (
    <>
      {data.map(course => (
        <Link
          key={course.id}
          href={{ pathname: "/courses/[id]", query: { id: `${course.id}` } }}
          as={`/courses/${course.id}`}
        >
          <CourseLink>
            <StyledCard key={course.id}>
              <CardContent>{course.title || course.id}</CardContent>
            </StyledCard>
          </CourseLink>
        </Link>
      ))}
    </>
  )
}

export default CourseList
