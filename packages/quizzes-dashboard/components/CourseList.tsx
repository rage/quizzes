import React, { useState } from "react"
import styled from "styled-components"
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core"
import Link from "next/link"
import { Course } from "../types/Quiz"
import _ from "lodash"
import DebugDialog from "./DebugDialog"
import SkeletonLoader from "./Shared/SkeletonLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
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
  width: 80%;
`

const QuizStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 15%;
`

const StatusCircleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 5%;
`

interface CourseListProps {
  data: Course[] | undefined
  error: any
}

const CourseList = ({ data, error }: CourseListProps) => {
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showActiveCourses, setShowActiveCourses] = useState(true)
  const [showEndedCourses, setShowEndedCourses] = useState(false)

  if (error) {
    return <div>Error while fetching courses.</div>
  }

  if (!data) return <SkeletonLoader height={50} skeletonCount={15} />

  let order: "asc" | "desc" = "asc"
  if (sortOrder === "desc") {
    order = "desc"
  }
  const statusFilters = [
    ...(showActiveCourses ? ["active"] : []),
    ...(showEndedCourses ? ["ended"] : []),
  ]
  const courses = _.chain(data)
    .filter(course => {
      return statusFilters.includes(course.status)
    })
    .orderBy([sortBy], [order])
    .value()

  return (
    <>
      <OptionWrapper>
        <FormGroup row>
          <FormControlLabel
            label="show active"
            control={
              <Switch
                checked={showActiveCourses}
                onChange={event => setShowActiveCourses(event.target.checked)}
              ></Switch>
            }
          ></FormControlLabel>
          <FormControlLabel
            label="show ended"
            control={
              <Switch
                checked={showEndedCourses}
                onChange={event => setShowEndedCourses(event.target.checked)}
              ></Switch>
            }
          ></FormControlLabel>
        </FormGroup>
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
            <StyledCard key={course.id}>
              <StyledCardContent>
                <QuizNameWrapper>{course.title || course.id}</QuizNameWrapper>
                <StatusCircleContainer>
                  <FontAwesomeIcon
                    icon={faCircle}
                    color={course.status === "active" ? "green" : "red"}
                  />
                </StatusCircleContainer>
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
