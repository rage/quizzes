// import * as appRoot from "app-root-path"
/* eslint-disable no-var-requires */
const appRoot = require("app-root-path")
const { createLogger, format, transports } = require("winston")
/* eslint-enable no-var-requires */

const LOG_DIRECTORY =
  process.env.LOG_DIRECTORY || `${appRoot}/packages/migration/src/`

const myFormat = format.printf(({ timestamp, message }: any) => {
  return `${timestamp}: ${message}`
})

const options = {
  file: {
    level: "info",
    filename: `${LOG_DIRECTORY}migration.log`,
    /*handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,*/
  },
  console: {
    level: "info",
    /*handleExceptions: true,
    json: false,
    colorize: true,*/
  },
}

const logger = createLogger({
  format: format.combine(format.timestamp(), myFormat),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
})

export { logger }
