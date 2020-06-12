const withPlugins = require("next-compose-plugins")

const withCSS = require("@zeit/next-css")

require("dotenv").config()

const nextConfiguration = {}

module.exports = withPlugins(
  [
    withCSS,
    {
      env: {
        TOKEN: process.env.TOKEN,
      },
    },
  ],
  nextConfiguration,
)
