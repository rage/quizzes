const neutrino = require("neutrino")

const dev = process.env.NODE_ENV !== "production"

const config = neutrino().webpack()

if (dev) {
  config["entry"]["index"].unshift("babel-polyfill")
  console.log(config)
}

module.exports = config
