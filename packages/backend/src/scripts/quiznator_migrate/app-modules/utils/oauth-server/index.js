const oauthServer = require("oauth2-server")
const ObjectId = require("bson-objectid")
const randomString = require("randomstring")

const oauthModels = require("../../models/oauth")
const User = require("../../models/user")

const ONE_HOUR = 1000 * 60 * 60

function removeExpiredTokens() {
  oauthModels.AccessToken.removeExpired()
  oauthModels.RefreshToken.removeExpired()
}

function generateToken(type, req, callback) {
  const uniquePart = ObjectId().toHexString()
  const randomPart = randomString.generate({ length: 32 })

  callback(null, `${uniquePart}${randomPart}`)
}

setTimeout(removeExpiredTokens, ONE_HOUR)

removeExpiredTokens()

module.exports = oauthServer({
  model: {
    getAccessToken: (bearerToken, callback) =>
      oauthModels.AccessToken.getAccessToken(bearerToken, callback),
    getClient: (clientId, clientSecret, callback) =>
      oauthModels.Client.getClient(clientId, clientSecret, callback),
    grantTypeAllowed: (clientId, grantType, callback) =>
      oauthModels.Client.grantTypeAllowed(clientId, grantType, callback),
    saveAccessToken: (accessToken, clientId, expires, user, callback) =>
      oauthModels.AccessToken.saveAccessToken(
        accessToken,
        clientId,
        expires,
        user,
        callback,
      ),
    getRefreshToken: (refreshToken, callback) =>
      oauthModels.RefreshToken.getRefreshToken(refreshToken, callback),
    saveRefreshToken: (refreshToken, clientId, expires, user, callback) =>
      oauthModels.RefreshToken.saveRefreshToken(
        refreshToken,
        clientId,
        expires,
        user,
        callback,
      ),
    getUser: (username, password, callback) => {
      User.authenticate(username, password)
        .then(user => {
          callback(null, { id: user._id, user })
        })
        .catch(err => {
          callback(false, null)
        })
    },
    getAuthCode: (authCode, callback) =>
      oauthModels.AuthorizationCode.getAuthCode(authCode, callback),
    saveAuthCode: (authCode, clientId, expires, user, callback) =>
      oauthModels.AuthorizationCode.saveAuthCode(
        authCode,
        clientId,
        expires,
        user,
        callback,
      ),
    generateToken,
    refreshTokenLifetime: 1209600,
    accessTokenLifeTime: 3600,
  },
  grants: ["password", "refresh_token", "authorization_code"],
  debug: true,
  clientIdRegex: /^[A-Za-z0-9_-]{3,64}$/i,
})
