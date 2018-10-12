const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Quiz" },
  answerId: { type: String, required: true, ref: "QuizAnswer" },
  answererId: { type: String, required: true },
  status: {
    pass: { type: mongoose.Schema.Types.Boolean, required: false },
    review: { type: mongoose.Schema.Types.Boolean, required: false },
    rejected: { type: mongoose.Schema.Types.Boolean, required: false },
    reason: { type: mongoose.Schema.Types.String, required: false },
  },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
})

require("./methods")(schema)

module.exports = mongoose.model("QuizReviewAnswer", schema)
