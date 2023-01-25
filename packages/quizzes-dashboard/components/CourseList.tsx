import React, { useState } from "react"
import styled from "styled-components"
import {
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Checkbox,
  CardHeader,
} from "@material-ui/core"
import Link from "next/link"
import { Course } from "../types/Quiz"
import _ from "lodash"
import DebugDialog from "./DebugDialog"
import SkeletonLoader from "./Shared/SkeletonLoader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter } from "@fortawesome/free-solid-svg-icons"

interface CourseListProps {
  data: Course[] | undefined
  error: any
}

const SortingContainer = styled.div`
  margin-top: 19px;
  display: flex;
  flex-direction: row;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`

const ToggleFilterContainer = styled.div`
  display: flex;
  width: 30%;
  justify-content: space-evenly;
`

const SelectContainer = styled.div`
  display: flex;
  width: 70%;
`

interface CourseCardProps {
  courseId: string
  name: string
  abbreviation: string
  active: boolean
}

const ActiveText = styled.span`
  color: #009e2c;
  float: right;
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
`
const EndedText = styled.span`
  color: #d00019;
  float: right;
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
`

const CardContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
  margin-bottom: 16px;
`

const CourseCard: React.FC<CourseCardProps> = ({
  courseId,
  name,
  abbreviation,
  active,
}) => {
  return (
    <Link key={courseId} href={`/courses/${courseId}/listing`} passHref>
      <CardContainer>
        <Card>
          <CardHeader title={name} subheader={abbreviation} />
          {active ? (
            <ActiveText> active </ActiveText>
          ) : (
            <EndedText> ended </EndedText>
          )}
        </Card>
      </CardContainer>
    </Link>
  )
}

const CourseList = ({ data, error }: CourseListProps) => {
  const [filterWord, setFilterWord] = useState("")
  const [sortOrder, setSortOrder] = useState("alphabetic-ascending")
  const [showActiveCourses, setShowActiveCourses] = useState(true)
  const [showEndedCourses, setShowEndedCourses] = useState(false)

  if (error) {
    return <div>Error while fetching courses.</div>
  }

  if (!data) return <SkeletonLoader height={50} skeletonCount={15} />

  const getFilteredAndSortedCourses = () => {
    let courses = _.chain(data)
    if (!showActiveCourses) {
      courses = courses.filter(course => course.status !== "active")
    }
    if (!showEndedCourses) {
      courses = courses.filter(course => course.status !== "ended")
    }
    if (filterWord.trim() !== "") {
      const filterWordLowerCase = filterWord.toLowerCase()
      courses = courses.filter(
        course =>
          course.title.toLowerCase().includes(filterWordLowerCase) ||
          course.abbreviation.toLowerCase().includes(filterWordLowerCase),
      )
    }
    switch (sortOrder) {
      case "alphabetic-ascending":
        courses = courses.sort((a, b) => {
          if (a.title < b.title) {
            return -1
          } else if (a.title > b.title) {
            return 1
          } else {
            return 0
          }
        })
        break
      case "alphabetic-descending":
        courses = courses.sort((a, b) => {
          if (a.title < b.title) {
            return 1
          } else if (a.title > b.title) {
            return -1
          } else {
            return 0
          }
        })
        break
      case "created-at-oldest-first":
        courses = courses.sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1
          } else if (a.createdAt > b.createdAt) {
            return -1
          } else {
            return 0
          }
        })
        break
      case "created-at-latest-first":
        courses = courses.sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return -1
          } else if (a.createdAt > b.createdAt) {
            return 1
          } else {
            return 0
          }
        })
        break
      case "updated-at-latest-first":
        courses = courses.sort((a, b) => {
          if (a.updatedAt < b.updatedAt) {
            return -1
          } else if (a.updatedAt > b.updatedAt) {
            return 1
          } else {
            return 0
          }
        })
        break
      case "updated-at-oldest-first":
        courses = courses.sort((a, b) => {
          if (a.updatedAt < b.updatedAt) {
            return 1
          } else if (a.updatedAt > b.updatedAt) {
            return -1
          } else {
            return 0
          }
        })
        break
    }
    return courses.value()
  }

  const courses = getFilteredAndSortedCourses()

  return (
    <>
      <Card elevation={0}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Filter courses"
            id="outlined-start-adornment"
            value={filterWord}
            onChange={evt => {
              setFilterWord(evt.target.value)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faFilter} />
                </InputAdornment>
              ),
            }}
          />

          <SortingContainer>
            <SelectContainer>
              <TextField
                fullWidth
                select
                variant="outlined"
                id="course-sorting-order"
                value={sortOrder}
                label="Sort courses"
                onChange={evt => {
                  setSortOrder(evt.target.value)
                }}
              >
                <MenuItem value={"alphabetic-ascending"}>
                  Ascending alphabetical order
                </MenuItem>
                <MenuItem value={"alphabetic-descending"}>
                  Descending alphabetical order
                </MenuItem>
                <MenuItem value={"created-at-latest-first"}>
                  Created at, latest first{" "}
                </MenuItem>
                <MenuItem value={"created-at-oldest-first"}>
                  Created at, oldest first{" "}
                </MenuItem>
                <MenuItem value={"updated-at-latest-first"}>
                  Updated at, latest first{" "}
                </MenuItem>
                <MenuItem value={"updated-at-oldest-first"}>
                  Updated at, oldest first{" "}
                </MenuItem>
              </TextField>
            </SelectContainer>

            <ToggleFilterContainer>
              <CheckboxContainer>
                <p>Active: </p>
                <Checkbox
                  value={showActiveCourses}
                  checked={showActiveCourses}
                  onClick={() => setShowActiveCourses(!showActiveCourses)}
                />
              </CheckboxContainer>
              <CheckboxContainer>
                <p>Ended: </p>
                <Checkbox
                  value={showEndedCourses}
                  checked={showEndedCourses}
                  onClick={() => setShowEndedCourses(!showEndedCourses)}
                />
              </CheckboxContainer>
            </ToggleFilterContainer>
          </SortingContainer>
        </CardContent>
      </Card>

      {courses.map(course => (
        <CourseCard
          courseId={course.id}
          name={course.title}
          abbreviation={course.abbreviation}
          active={course.status === "active"}
        />
      ))}

      <DebugDialog object={courses} />
    </>
  )
}

export default CourseList
