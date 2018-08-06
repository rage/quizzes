const request = require("request-promise")

function getProfile(accessToken) {
  const options = {
    method: "GET",
    uri: `${
      process.env.TMC_URL
    }/api/beta/participant?access_token=${accessToken}`,
  }

  return request(options).then(response => JSON.parse(response))
}

module.exports = { getProfile }
