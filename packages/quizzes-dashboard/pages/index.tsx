import React from "react"
import CourseList from "../components/CourseList"
import useSWR from "swr"
import { fetchCourses } from "../services/quizzes"
import useBreadcrumbs from "../hooks/useBreadcrumbs"

const Index = () => {
  const { data, error } = useSWR("null", fetchCourses)
  useBreadcrumbs([{ label: "Courses" }])
  return (
    <>
      <CourseList data={data} error={error} />
    </>
  )
}

export default Index
