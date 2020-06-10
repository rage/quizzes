const withPlugins = require("next-compose-plugins")

const withCSS = require("@zeit/next-css")

require("dotenv").config()

const basePath = process.env.BASE_PATH || ""

const nextConfiguration = {
  assetPrefix: basePath,
  publicRuntimeConfig: {
    basePath: basePath,
  },
}

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
