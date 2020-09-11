import React, { useState } from "react"
import EditableTextForm from "./EditableTextForm"
import { Course } from "../../types/Quiz"
import { Typography } from "@material-ui/core"

export const EditableCourseInfo = ({ course }: { course: Course }) => {
  let HOST = "http://localhost:3003"
  const DASHBOARD_API = `/api/v2/dashboard/courses/${course.id}/`

  if (process.env.NODE_ENV === "production") {
    HOST = "https://quizzes.mooc.fi"
  }

  const editTitleUrl = HOST + DASHBOARD_API + `modify-course-title`
  const editAbbreviationUrl =
    HOST + DASHBOARD_API + `modify-course-abbreviation`
  const editMoocFiUrl = HOST + DASHBOARD_API + `modify-moocId`

  return (
    <>
      <Typography
        variant="h3"
        component="h1"
        style={{ marginBottom: "0.75rem" }}
      >
        Editing: {course.title}
      </Typography>
      <EditableTextForm
        formUrl={editTitleUrl}
        name="title"
        label="title"
        value={course.title}
      />
      <EditableTextForm
        formUrl={editAbbreviationUrl}
        name="abbreviation"
        label="abbreviation"
        value={course.abbreviation}
      />
      <EditableTextForm
        formUrl={editMoocFiUrl}
        name="moocfiid"
        label="moocfi-id"
        value={course.moocfiId!}
      />
    </>
  )
}

export default EditableCourseInfo
