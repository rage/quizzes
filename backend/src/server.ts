import errorHandler from "errorhandler"

import app from "./app"
import db from "./database"

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

const Op = db.Sequelize.Op

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

db.sequelize.sync().then(async () => {
  let org = await db.Organization.findById(1)
  if (!org) {
    org = await db.Organization.create({
      id: 1,
    })
  }

  let lang = await db.Language.findById("en_US")
  if (!lang) {
    lang = await db.Language.create({
      id: "en_US",
      name: "English",
      country: "USA",
    })
  }

  let tr = await db.TextResource.find({
    where: {
      [Op.and]: [
        { id: "d1c1743b-7234-4d50-a04c-8c5c8c2780f8" },
        { language_id: "en_US" },
      ],
    },
  })
  if (!tr) {
    tr = await db.TextResource.create({
      id: "d1c1743b-7234-4d50-a04c-8c5c8c2780f8",
      language_id: "en_US",
      value: "foobar",
    })
  }
})

export default server
