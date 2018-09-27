const mongoose = require("mongoose")

const schema = new mongoose.Schema(
  {
    sourceQuizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    targetAnswererId: { type: String, required: true },
    giverAnswererId: { type: String, required: true },
    review: { type: String, maxlength: 10000, minlength: 1, required: true },
    rejectedQuizAnswerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAnswer",
      required: true,
    },
    chosenQuizAnswerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizAnswer",
      required: true,
    },
    grading: { type: mongoose.Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
)

require("./methods")(schema)

module.exports = mongoose.model("PeerReview", schema)
