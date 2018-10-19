export class ITMCProfile {
  username: string
  accessToken: string
}

export interface ITMCProfileDetails {
  id: number
  username: string
  email: string
  administrator: boolean
  error?: string
  user_field?: {
    first_name: string
    last_name: string
    organizational_id: string
    course_announcements: boolean
  }
  extra_fields?: {
    language: string
    open_university: string
    helsinki_university: string
    research: string
    marketing: string
    deadline: string
  }
}

export interface ITMCLoginCredentials {
  username: string
  password: string
}

export interface IQuizQuery {
  id?: string
  course?: boolean
  language?: string
  items?: boolean
  options?: boolean
  peerreviews?: boolean
}

export interface IQuizAnswerQuery {
  id?: string
  quiz_id?: string
  user_id?: number
}
