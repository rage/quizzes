const mongoose = require("mongoose")

const validators = require("../../utils/validators")
const errors = require("../../errors")

module.exports = schema => {
  schema.statics.authenticate = function(email, password) {
    return this.findOne({ email }).then(user => {
      var invalidError = new errors.ForbiddenError("Invalid email or password")

      if (!user) {
        return Promise.reject(invalidError)
      } else {
        return null
      }
    })
  }

  schema.methods.getTags = function() {
    const pipeline = [
      { $match: { userId: this._id } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
    ]

    return mongoose.models.Quiz.aggregate(pipeline).then(aggregation =>
      (aggregation || []).map(row => row._id),
    )
  }

  schema.methods.canInspectAnswersOfQuiz = function(quiz) {
    return quiz.userId.toString() === this._id.toString()
  }

  schema.methods.toJSON = function() {
    let toObject = this.toObject()

    delete toObject["passwordHash"]

    return toObject
  }

  schema
    .virtual("password")
    .get(function() {
      return this._password
    })
    .set(function(value) {
      if (value && value.length < 6) {
        this.invalidate("password", "must be at least 6 characters.")
      }

      if (this.isNew && !value) {
        this.invalidate("password", "required")
      }

      this._password = value
    })

  schema.pre("save", validators.isUnique({ scope: "email", model: "User" }))
}
