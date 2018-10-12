const mongoose = require("mongoose")
mongoose.Promise = require("bluebird").Promise

const quizTypes = require("../../constants/quiz-types")
const modelUtils = require("../../utils/models")

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.keys(quizTypes), required: true },
    title: { type: String, minlength: 3, maxlength: 100, required: true },
    body: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    tags: {
      type: Array,
      default: [],
      validate: tags => {
        if (!tags || tags.length === 0) {
          return true
        } else {
          return tags.filter(tag => typeof tag !== "string").length === 0
        }
      },
      message: "{VALUE} is not an array of strings",
    },
    populateAnswers: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: true },
)

require("./methods")(schema)

modelUtils.extendSchema(schema)

module.exports = mongoose.model("Quiz", schema)
