import React, { useState } from "react"
import styled from "styled-components"
import { Card, CardContent, TextField, MenuItem } from "@material-ui/core"
import Link from "next/link"
import { Course } from "../types/Quiz"
import _ from "lodash"
import DebugDialog from "./DebugDialog"
import SkeletonLoader from "./Shared/SkeletonLoader"

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const CourseLink = styled.a`
  color: white;
  text-decoration: none;
  cursor: pointer;
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
