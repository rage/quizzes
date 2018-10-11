const mongoose = require("mongoose")
const _ = require("lodash")
const errors = require("../../errors")

module.exports = schema => {
  schema.statics.findPeerReviewsForAnswerer = function(options) {
    return this.find(
      { quizId: options.quizId, giverAnswererId: options.answererId },
      { _id: 0, chosenQuizAnswerId: 1 },
    )
      .then(reviews =>
        reviews.map(review =>
          mongoose.Types.ObjectId(review.chosenQuizAnswerId.toString()),
        ),
      )
      .then(chosenQuizAnswerIds => {
        const query = {
          quizId: mongoose.Types.ObjectId(options.quizId.toString()),
          answererId: { $ne: options.answererId },
          _id: { $nin: chosenQuizAnswerIds },
          rejected: false,
          confirmed: false,
        }

        return mongoose.models.QuizAnswer.findDistinctlyByAnswerer(query, {
          limit: options.limit + 20,
          skip: options.skip,
          sort: { peerReviewCount: 1 },
        }).then(reviews => _.sampleSize(reviews, options.limit))
      })
  }

  schema.statics.findPeerReviewsGivenToAnswerer = function(options) {
    const query = {
      quizId: options.quizId,
      targetAnswererId: options.answererId,
    }

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .exec()
  }

  schema.pre("save", function(next) {
    mongoose.models.QuizAnswer.update(
      { _id: this.chosenQuizAnswerId },
      { $inc: { peerReviewCount: 1 } },
    )
      .then(() => next())
      .catch(next)
  })

  schema.pre("validate", function(next) {
    if (!this.chosenQuizAnswerId) {
      return next()
    }

    errors
      .withExistsOrError(
        new errors.NotFoundError(
          `Couldn't find quiz answer with id ${this.chosenQuizAnswerId}`,
        ),
      )(mongoose.models.QuizAnswer.findOne({ _id: this.chosenQuizAnswerId }))
      .then(chosenAnswer => {
        this.targetAnswererId = chosenAnswer.answererId

        next()
      })
      .catch(next)
  })
}
