const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  _id: { type: String },
})

module.exports = mongoose.model("QuizAnswerSpamFlag", schema)
