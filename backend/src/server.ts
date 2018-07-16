import errorHandler from "errorhandler"

import app from "./app"
import db from "./database"

import { Language, Organization } from "./models"

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
  )
  console.log("  Press CTRL-C to stop\n")
})

db.promise.then(async () => {
  let org = await Organization.findOne(1)
  if (!org) {
    org = new Organization()
    org.id = 1
    await org.save()
  }

  let lang = await Language.findOne("en_US")
  if (!lang) {
    lang = new Language()
    lang.id = "en_US"
    lang.name = "English"
    lang.country = "USA"
    await lang.save()
  }
})

export default server
