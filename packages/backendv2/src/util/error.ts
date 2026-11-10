import { DatabaseError } from "pg"

class CustomError extends Error {
  constructor(params: any) {
    super(params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
  }
}

export class NotFoundError extends CustomError {}

export class UnauthorizedError extends CustomError {}

export class ForbiddenError extends CustomError {}

export class BadRequestError extends CustomError {}

export class MalformedPayloadError extends CustomError {}

/** The Postgres error behind `error`, whether thrown by pg itself or wrapped by objection. */
export const databaseErrorOf = (error: unknown): DatabaseError | undefined => {
  const cause =
    (error as { nativeError?: unknown } | null)?.nativeError ?? error
  return cause instanceof DatabaseError ? cause : undefined
}
