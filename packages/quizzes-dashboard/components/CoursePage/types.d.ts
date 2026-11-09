import type React from "react"

export interface ITabToComponent {
  [key: string]: (props: any) => React.JSX.Element
}

export interface EditCoursePayloadFields {
  courseId?: string
  moocfiId?: string
  title?: string
  abbreviation?: string
  languageId?: string
  status?: string
}
