const Promise = require("bluebird")

function ApiError(message, properties) {
  this.name = "ApiError"
  this.message = message || "Something went wrong"
  this.properties = properties || {}
  this.stack = new Error().stack
}

ApiError.prototype = Object.create(Error.prototype)

function NotFoundError(message, properties) {
  ApiError.call(this, message || "Not found", properties || {})

  this.name = "NotFoundError"
}

NotFoundError.prototype = Object.create(ApiError.prototype)

function InvalidRequestError(message, properties) {
  ApiError.call(this, message || "Invalid request", properties || {})

  this.name = "InvalidRequestError"
}

InvalidRequestError.prototype = Object.create(ApiError.prototype)

function ForbiddenError(message, properties) {
  ApiError.call(this, message || "Forbidden", properties || {})

  this.name = "ForbiddenError"
}

ForbiddenError.prototype = Object.create(ApiError.prototype)

function withExistsOrError(error) {
  return promise => {
    return promise.then(value => {
      if (value === null || value === undefined) {
        return Promise.reject(error)
      } else {
        return value
      }
    })
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  InvalidRequestError,
  ForbiddenError,
  withExistsOrError,
}
