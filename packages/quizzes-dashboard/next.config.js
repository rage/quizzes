const withPlugins = require("next-compose-plugins")

const withCSS = require("@zeit/next-css")

require("dotenv").config()

const nextConfiguration = {
  env: {
    TOKEN: process.env.TOKEN,
  },
}

module.exports = withPlugins([withCSS], nextConfiguration)
