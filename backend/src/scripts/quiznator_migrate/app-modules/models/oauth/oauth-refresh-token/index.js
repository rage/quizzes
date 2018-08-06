const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  expires: { type: Date },
  refreshToken: { type: String, required: true },
  clientId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
})

schema.statics.getRefreshToken = function(refreshToken, callback) {
  this.findOne({ refreshToken }, callback)
}

schema.statics.removeExpired = function() {
  return this.remove({ expires: { $lte: new Date() } })
}

schema.statics.saveRefreshToken = function(
  token,
  clientId,
  expires,
  user,
  callback,
) {
  this.create(
    {
      userId: user.id,
      clientId,
      refreshToken: token,
      clientId,
      expires,
      userId: user.id,
    },
    callback,
  )
}

module.exports = mongoose.model("OAuthRefreshToken", schema)
