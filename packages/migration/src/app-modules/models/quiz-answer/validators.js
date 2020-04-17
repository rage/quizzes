const mongoose = require("mongoose")
const _ = require("lodash")
const Promise = require("bluebird")
const errors = require("../../errors")

const quizTypes = require("../../constants/quiz-types")

module.exports = schema => {
  const validateDataByType = (data, type) => {
    const validateWith = (answer, validator) => {
      if (!validator(data)) {
        return Promise.reject(new errors.InvalidRequestError("data is invalid"))
      } else {
        return Promise.resolve()
      }
    }

    const notEmptyString = data =>
      data && typeof data === "string" && data.length > 0
    const notEmptyArrayOfStrings = data =>
      _.isArray(data) && data.every(value => typeof value === "string")

    const typeValidators = {
      [quizTypes.MULTIPLE_CHOICE](data) {
        return validateWith(data, notEmptyString)
      },
      [quizTypes.ESSAY](data) {
        return validateWith(data, notEmptyString)
      },
      [quizTypes.CHECKBOX](data) {
        return validateWith(data, notEmptyArrayOfStrings)
      },
      [quizTypes.PRIVACY_AGREEMENT](data) {
        return validateWith(data, notEmptyArrayOfStrings)
      },
      [quizTypes.PEER_REVIEW](data) {
        const schema = {
          chosen: { presence: true },
          rejected: { presence: true },
          review: { presence: true },
        }

        return validators.validate(data, schema).then(
          success => Promise.resolve(),
          error => Promise.reject("data is invalid"),
        )
      },
    }

    if (!typeValidators[type]) {
      return Promise.resolve()
    } else {
      return typeValidators[type](data)
    }
  }

  function validateAnswerData(quiz) {
    if (!quiz.type) {
      return Promise.resolve()
    } else {
      return validateDataByType(this.data, quiz.type)
    }
  }

  function validateQuizExpiration(quiz) {
    if (quiz.expiresAt && +new Date(quiz.expiresAt) - +new Date() <= 0) {
      return Promise.reject(
        new errors.InvalidRequestError(
          `Couldn't create an answer because quiz has expired`,
        ),
      )
    } else {
      return Promise.resolve()
    }
  }

  schema.pre("save", function(next) {
    if (!this.quizId || !this.data) {
      return next()
    }

    errors
      .withExistsOrError(
        new errors.NotFoundError(`Couldn't find quiz with id ${this.quizId}`),
      )(mongoose.models.Quiz.findOne({ _id: this.quizId }))
      .then(quiz => {
        return Promise.all([
          validateAnswerData.call(this, quiz),
          validateQuizExpiration.call(this, quiz),
        ])
      })
      .then(() => next())
      .catch(err => next(err))
  })
}
