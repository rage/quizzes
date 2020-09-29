export interface ITabToComponent {
  [key: string]: () => JSX.Element
}

export interface EditCoursePayloadFields {
  courseId?: string
  moocfiId?: string
  title?: string
  abbreviation?: string
  languageId?: string
}
