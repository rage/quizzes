import winston from "winston"
import { ParameterizedContext } from "koa"

export interface CustomContext extends ParameterizedContext {
  log: winston.Logger
}

export interface CustomState {
  user: UserInfo
  start: number
}

export interface UserInfo {
  id: number
  username: string
  email: string
  user_field: UserField
  extra_fields: ExtraFields
  administrator: boolean
}

export interface ExtraFields {}

export interface UserField {
  first_name: string
  last_name: string
  html1: string
  organizational_id: string
  course_announcements: boolean
}
