import React, { useState } from "react"
import styled from "styled-components"
import { Card, CardContent, TextField, MenuItem } from "@material-ui/core"
import Link from "next/link"
import Skeleton from "@material-ui/lab/Skeleton"
import { Course } from "../types/Quiz"
import _ from "lodash"
import DebugDialog from "./DebugDialog"

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

const SortSelector = styled(TextField)`
  display: flex !important;
  width: 25% !important;
  margin-right: 1rem !important;
  @media only screen and (max-width: 600px) {
    width: 100% !important;
  }
`

const OrderSelector = styled(TextField)`
  display: flex !important;
  width: 25% !important;
  @media only screen and (max-width: 600px) {
    width: 100% !important;
  }
`

const OptionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  @media only screen and (max-width: 600px) {
    justify-content: space-between;
  }
`

interface CourseListProps {
  data: Course[] | undefined
  error: any
}

const CourseList = ({ data, error }: CourseListProps) => {
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")

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

  let order: "asc" | "desc" = "asc"
  if (sortOrder === "desc") {
    order = "desc"
  }
  const courses = _.orderBy(data, [sortBy], [order])

  return (
    <>
      <OptionWrapper>
        <SortSelector
          variant="outlined"
          select
          value={sortBy}
          onChange={event => setSortBy(event.target.value)}
        >
          <MenuItem value="title">Alphabetical</MenuItem>
          <MenuItem value="createdAt">Created at</MenuItem>
          <MenuItem value="updatedAt">Updated at</MenuItem>
        </SortSelector>
        <OrderSelector
          variant="outlined"
          select
          value={sortOrder}
          onChange={event => setSortOrder(event.target.value)}
        >
          <MenuItem value="asc">
            {sortBy === "title" ? "[A - Z]" : "Oldest first"}
          </MenuItem>
          <MenuItem value="desc">
            {sortBy === "title" ? "[Z - A]" : "Latest  first"}
          </MenuItem>
        </OrderSelector>
      </OptionWrapper>
      {courses.map(course => (
        <Link
          key={course.id}
          href={{
            pathname: "/courses/[courseId]/[...page]",
            query: { courseId: `${course.id}` },
          }}
          as={`/courses/${course.id}/listing`}
        >
          <CourseLink>
            <StyledCard key={course.id}>
              <CardContent>{course.title || course.id}</CardContent>
            </StyledCard>
          </CourseLink>
        </Link>
      ))}

      <DebugDialog object={courses} />
    </>
  )
}

export default CourseList
