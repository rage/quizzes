const validateJs = require("validate.js")
const mongoose = require("mongoose")
const errors = require("../../errors")

validateJs.Promise = require("bluebird").Promise

function validate(attributes, schema) {
  return validateJs.async(attributes, schema)
}

function isUnique(options) {
  return function(next) {
    var query = {}

    query[options.scope] = this[options.scope]

    mongoose.models[options.model].findOne(query).then(object => {
      if (!object) {
        next()
      } else if (
        object &&
        !this.isNew &&
        this._id.toString() === object._id.toString()
      ) {
        next()
      } else {
        this.invalidate(options.scope, "is not unique")
        next(
          new errors.InvalidRequestError(
            `${options.scope} is not unique in ${options.model}`,
          ),
        )
      }
    })
  }
}

function validateEmail(email) {
  const regExp = /.+@.+\..+/

  if (email === undefined || email === null) {
    return true
  } else if (typeof email !== "string") {
    return false
  } else {
    return regExp.test(email)
  }
}

module.exports = { validate, validateEmail, isUnique }
