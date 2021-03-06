import React, { useState } from "react"
import styled from "styled-components"
import { Card, CardContent, TextField, MenuItem } from "@material-ui/core"
import Link from "next/link"
import { Course } from "../types/Quiz"
import _ from "lodash"
import DebugDialog from "./DebugDialog"
import SkeletonLoader from "./Shared/SkeletonLoader"

const StyledCard = styled(Card)<{ status: string }>`
  margin-bottom: 1rem;
  background: ${props => {
    if (props.status === "active") {
      return "#b9f6ca !important"
    }
    if (props.status === "ended") {
      return "#ffccbc !important"
    }
  }};
`

const StyledCardContent = styled(CardContent)`
  display: flex !important;
`

const SortSelector = styled(TextField)`
  display: flex !important;
  width: 25% !important;
  margin-right: 1rem !important;
`

const OrderSelector = styled(TextField)`
  display: flex !important;
  width: 25% !important;
`

const OptionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
`

const CourseLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
`

const QuizNameWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`

const QuizStatusWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
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

  if (!data) return <SkeletonLoader height={50} skeletonCount={15} />

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
        <Link key={course.id} href={`/courses/${course.id}/listing`} passHref>
          <CourseLink>
            <StyledCard key={course.id} status={course.status}>
              <StyledCardContent>
                <QuizNameWrapper>{course.title || course.id}</QuizNameWrapper>
                <QuizStatusWrapper>{course.status}</QuizStatusWrapper>
              </StyledCardContent>
            </StyledCard>
          </CourseLink>
        </Link>
      ))}

      <DebugDialog object={courses} />
    </>
  )
}

export default CourseList
