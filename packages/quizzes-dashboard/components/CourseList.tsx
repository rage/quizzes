import React from "react"
import styled from "styled-components"
import { Card, CardContent, Typography } from "@material-ui/core"
import Link from "next/link"
import Skeleton from "@material-ui/lab/Skeleton"
import { Course } from "../types/Quiz"

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

const StyledTitle = styled(Typography)`
  display: flex !important;
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
`

interface CourseListProps {
  data: Course[] | undefined
  error: any
}

const CourseList = ({ data, error }: CourseListProps) => {
  if (error) {
    return <div>Error while fetching courses.</div>
  }
  if (!data) {
    return (
      <>
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
        <StyledSkeleton variant="rect" height={50} animation="wave" />
      </>
    )
  }
  return (
    <>
      <StyledTitle variant="h2">All courses</StyledTitle>
      {data.map(course => (
        <Link
          key={course.id}
          href={{
            pathname: "/courses/[courseId]",
            query: { courseId: `${course.id}` },
          }}
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
