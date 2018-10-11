const mongoose = require("mongoose")
const objectId = require("bson-objectid")
const randomString = require("randomstring")

const schema = new mongoose.Schema({
  expires: { type: Date },
  authCode: { type: String, required: true },
  clientId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
})

schema.statics.getAuthCode = function(authCode, callback) {
  this.findOne({ authCode }, callback)
}

schema.statics.removeExpired = function() {
  return this.remove({ expires: { $lte: new Date() } })
}

schema.statics.generateAuthCode = function({ clientId, userId }) {
  const authCode = `${objectId().toHexString()}${randomString.generate({
    length: 16,
  })}`
  const expires = new Date(+new Date() + 1000 * 60 * 5)

  return this.create({ authCode, clientId, expires, userId }).then(
    () => authCode,
  )
}

schema.statics.saveAuthCode = function(
  authCode,
  clientId,
  expires,
  user,
  callback,
) {
  this.create({ authCode, clientId, expires, userId: user.id }, callback)
}

module.exports = mongoose.model("OAuthAuthorizationCode", schema)
