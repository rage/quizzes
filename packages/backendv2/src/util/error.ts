export class CustomError extends Error {
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
