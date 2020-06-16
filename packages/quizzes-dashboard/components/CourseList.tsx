import React from "react"
import styled from "styled-components"
import { Card, CardContent } from "@material-ui/core"
import Link from "next/link"
import { get } from "lodash"
import { Course } from "../types/Course"
import Skeleton from "@material-ui/lab/Skeleton"

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

interface Props {
  courses: Course[] | undefined
  error: any
}

const CourseList = ({ courses, error }: Props) => {
  if (error) {
    return <div>Error while fetching courses.</div>
  }
  if (!courses) {
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
      {courses.map(course => (
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
    </>
  )
}

export default CourseList
