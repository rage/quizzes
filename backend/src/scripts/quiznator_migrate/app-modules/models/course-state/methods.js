const mongoose = require("mongoose")

/*
  courseState
    completion
      completed: bool
      completionDate: date
      confirmationSent: bool
      confirmationSentDate: date
      ...
*/
module.exports = schema => {
  /*   schema.statics.setCourseState = function(answererId, courseId, data = []) {
    return this.findOneAndUpdate(
      { answererId }, 
      { $set: { data } }, // looks potentially dangerous
      { new: true, upsert: true }
    )
  }

  schema.statics.setCompletionState = function(answererId, courseId, data) {
    return this.findOneAndUpdate(
      { answererId, courseId },
      { $set: { completion: { data } } },
      { new: true, upsert: true }
    )
  } */

  schema.statics.getConfirmed = function(answererId, courseId) {
    return this.find({
      answererId,
      courseId,
      data: { completion: { confirmationSent: true } },
    })
  }
}
