export interface ITabToComponent {
  [key: string]: (any) => JSX.Element
}

export interface EditCoursePayloadFields {
  courseId?: string
  moocfiId?: string
  title?: string
  abbreviation?: string
  languageId?: string
}
