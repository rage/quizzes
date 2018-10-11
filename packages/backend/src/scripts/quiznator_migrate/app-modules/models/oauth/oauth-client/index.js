const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientSecret: { type: String },
})

schema.statics.getClient = function(clientId, clientSecret, callback) {
  if (clientSecret) {
    this.findOne({ clientId, clientSecret }, callback)
  } else {
    this.findOne({ clientId }, callback)
  }
}

schema.statics.grantTypeAllowed = function(clientId, grantType, callback) {
  callback(false, true)
}

module.exports = mongoose.model("OAuthClient", schema)
