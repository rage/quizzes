const mongoose = require("mongoose")

module.exports = schema => {
  schema.statics.getReviewable = function(quizId, answererId = null) {
    return this.aggregate([
      {
        $match: {
          quizId: mongoose.Types.ObjectId(quizId),
          "status.review": true,
        },
      },
      //answererId ? { $match: { answererId } } : undefined
    ]).exec()
  }

  schema.statics.getRejected = function(quizId, answererId = null) {
    return this.aggregate([
      {
        $match: {
          quizId: mongoose.Types.ObjectId(quizId),
          "status.rejected": true,
        },
      },
      !!answererId ? { $match: { answererId } } : undefined,
    ]).exec()
  }

  schema.statics.setReviewState = function(answerId) {
    return this.findOneAndUpdate(
      { answerId },
      { $set: { review: data } },
      { new: true, upsert: true },
    )
  }
}
