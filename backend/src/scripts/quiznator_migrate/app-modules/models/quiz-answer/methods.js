const QuizAnswerSpamFlag = require("./quiz-answer-spam-flag/index")
const mongoose = require("mongoose")
const _ = require("lodash")

module.exports = schema => {
  schema.methods.flagAsSpamBy = function(userId) {
    return QuizAnswerSpamFlag.create({ _id: `${userId}-${this._id}` })
      .then(() => {
        return mongoose.models.QuizAnswer.update(
          { _id: this._id },
          { $inc: { spamFlags: 1 } },
        )
      })
      .then(res => {
        this.spamFlags = (this.spamFlags || 0) + 1

        return this
      })
  }

  schema.methods.removeFlagSpamBy = function(userId) {
    return QuizAnswerSpamFlag.remove({ _id: `${userId}-${this._id}` })
      .then(() => {
        return mongoose.models.QuizAnswer.update(
          { _id: this._id },
          { $inc: { spamFlags: -1 } },
        )
      })
      .then(() => {
        this.spamFlags = Math.max(0, (this.spamFlags || 0) - 1)
      })
  }

  schema.methods.getSpamFlagBy = function(userId) {
    return QuizAnswerSpamFlag.findOne({ _id: `${userId}-${this._id}` }).then(
      flag => {
        return flag ? 1 : 0
      },
    )
  }

  schema.statics.findDistinctlyByAnswerer = function(query, options = {}) {
    let pipeline = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$answererId",
          data: { $first: "$data" },
          quizId: { $first: "$quizId" },
          answerId: { $first: "$_id" },
          createdAt: { $first: "$createdAt" },
          peerReviewCount: { $first: "$peerReviewCount" },
        },
      },
      options.sort ? { $sort: options.sort } : null,
      options.skip ? { $skip: options.skip } : null,
      options.limit ? { $limit: options.limit } : null,
    ].filter(p => !!p)

    return this.aggregate(pipeline).then(data => {
      return data.map(doc => ({
        _id: doc.answerId,
        answererId: doc._id,
        data: doc.data,
        quizId: doc.quizId,
        createdAt: doc.createdAt,
        peerReviewCount: doc.peerReviewCount,
      }))
    })
  }

  schema.statics.getLatestDistinctAnswer = function(
    answererId,
    quizzes,
    options = {},
  ) {
    const quizIds = Object.keys(quizzes).map(k => mongoose.Types.ObjectId(k))
    const essayQuizIds = Object.keys(quizzes)
      .map(k => mongoose.Types.ObjectId(k))
      .filter(id => quizzes[id].type === "ESSAY")

    let pipeline = [
      { $match: { answererId: answererId, quizId: { $in: quizIds } } },
      options.onlyConfirmed
        ? {
            $match: {
              $or: [{ confirmed: true }, { quizId: { $in: essayQuizIds } }],
            },
          }
        : null,
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$quizId",
          data: { $first: "$data" },
          quizId: { $first: "$quizId" },
          answererId: { $first: "$answererId" },
          answerId: { $first: "$_id" },
          createdAt: { $first: "$createdAt" },
          confirmed: { $first: "$confirmed" },
          rejected: { $first: "$rejected" },
          peerReviewCount: { $first: "$peerReviewCount" },
        },
      },
    ].filter(p => !!p)

    return this.aggregate(pipeline).then(data => {
      return data.map(doc => ({
        _id: doc.answerId,
        answererId: doc.answererId,
        data: doc.data,
        quizId: doc.quizId,
        createdAt: doc.createdAt,
        confirmed: doc.confirmed,
        rejected: doc.rejected,
        peerReviewCount: doc.peerReviewCount,
      }))
    })
  }

  schema.statics.getStatisticsByUser = function(
    answererId,
    quizzes,
    options = {},
  ) {
    const quizIds = Object.keys(quizzes).map(k => mongoose.Types.ObjectId(k))
    const essayQuizIds = Object.keys(quizzes)
      .map(k => mongoose.Types.ObjectId(k))
      .filter(id => quizzes[id].type === "ESSAY")

    let pipeline = [
      { $match: { answererId: answererId, quizId: { $in: quizIds } } },
      options.onlyConfirmed
        ? {
            $match: {
              $or: [{ confirmed: true }, { quizId: { $in: essayQuizIds } }],
            },
          }
        : null,
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$quizId",
          answerIds: { $push: "$_id" },
          try: { $sum: 1 },
        },
      },
      { $project: { _id: "$_id", answered: "$answerIds", tries: "$try" } },
    ].filter(p => !!p) //{ $size: '$answerIds' }

    // TODO: should this have unique tag combinations?

    const uniqueTags = [
      ...new Set(_.flatten(quizIds.map(id => quizzes[id].tags))),
    ]

    return this.aggregate(pipeline).then(data => {
      return {
        id: answererId,
        tags: uniqueTags,
        answered:
          data.map(quiz => ({
            [quiz._id]: {
              answerIds: quiz.answered,
              tries: quiz.tries,
            },
          })) || [],
        onlyConfirmed: options.onlyConfirmed || false,
        count: data.length || 0,
        total: quizIds.length,
      }
    })
  }

  schema.statics.getByQuizIds = function(quizIds, answererId) {
    if (!answererId || !quizIds || (!!quizIds && quizIds.length === 0)) {
      return Promise.esolve({})
    }

    let pipeline = [
      { $match: { answererId: answererId, quizId: { $in: quizIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$quizId",
          data: { $first: "$data" },
          quizId: { $first: "$quizId" },
          answererId: { $first: "$answererId" },
          answerId: { $first: "$_id" },
          createdAt: { $first: "$createdAt" },
          confirmed: { $first: "$confirmed" },
          rejected: { $first: "$rejected" },
          peerReviewCount: { $first: "$peerReviewCount" },
        },
      },
    ].filter(p => !!p)

    return this.aggregate(pipeline).then(data => {
      return data.map(doc => ({
        _id: doc.answerId,
        answererId: doc.answererId,
        data: doc.data,
        quizId: doc.quizId,
        createdAt: doc.createdAt,
        confirmed: doc.confirmed,
        rejected: doc.rejected,
        peerReviewCount: doc.peerReviewCount,
      }))
    })
  }

  schema.statics.getStatsByTag = function(quizzes, options = {}) {
    const quizIds = Object.keys(quizzes).map(k => mongoose.Types.ObjectId(k))
    const essayQuizIds = Object.keys(quizzes)
      .map(k => mongoose.Types.ObjectId(k))
      .filter(id => quizzes[id].type === "ESSAY")

    let pipeline = [
      { $match: { quizId: { $in: quizIds } } },
      options.onlyConfirmed
        ? {
            $match: {
              $or: [{ confirmed: true }, { quizId: { $in: essayQuizIds } }],
            },
          }
        : null,
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$quizId",
          quizId: { $first: "$quizId" },
          answererIds: { $addToSet: "$answererId" },
          totalTries: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$quizId",
          answererIds: "$answererIds",
          count: { $size: "$answererIds" },
          totalTries: "$totalTries",
        },
      },
    ].filter(p => !!p)

    return this.aggregate(pipeline).then(data => {
      return data.map(doc => ({
        quizId: doc._id,
        tags: _.get(quizzes, `[${doc._id}].tags`),
        answererIds: doc.answererIds,
        onlyConfirmed: options.onlyConfirmed || false,
        count: doc.count,
        totalTries: doc.totalTries,
      }))
    })
  }
}
