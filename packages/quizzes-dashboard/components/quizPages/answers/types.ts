export type TAnswersDisplayed = 10 | 50 | 100

export type TSortOptions = "asc" | "desc"

export interface IQueryParams {
  queryParams: {
    page: string
    quizId: string
    pageNo?: number
    size?: TAnswersDisplayed
    expandAll?: boolean
    sort?: TSortOptions
  }
}
