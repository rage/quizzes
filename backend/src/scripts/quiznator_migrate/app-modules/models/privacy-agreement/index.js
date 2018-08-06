const mongoose = require("mongoose")

const schema = mongoose.Schema(
  {
    answererId: { type: String, required: true },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    accepted: {
      type: Array,
      default: [],
      validate: accepted => {
        if (!accepted || accepted.length === 0) {
          return true
        } else {
          return accepted.filter(k => typeof k != "string").length === 0
        }
      },
      message: "{VALUE} is not array of strings",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("PrivacyAgreement", schema)
