// New Relic must load before every module it instruments, Sentry included.
if (process.env.NEW_RELIC_LICENSE_KEY) {
  require("newrelic")
}

import Sentry = require("@sentry/node")

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: `quizzes-backend@${process.env.GIT_COMMIT}`,
    // Request bodies and query data hold student answers.
    dataCollection: {
      userInfo: false,
      httpBodies: [],
      databaseQueryData: false,
    },
  })
}
