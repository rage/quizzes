const mongoose = require("mongoose")
const Promise = require("bluebird")

mongoose.Promise = Promise

Promise.promisifyAll(require("mongodb"))

const mongoClient = Promise.promisifyAll(require("mongodb").MongoClient)

function connect(url) {
  return Promise.promisify(mongoose.connect, { context: mongoose })(url)
}

function disconnect() {
  return Promise.promisify(mongoose.disconnect, { context: mongoose })()
}

async function clean() {
  const db = await mongoClient.connectAsync(process.env.MONGO_URI)
  await db.dropDatabaseAsync()
  await db.closeAsync()
}

module.exports = {
  connect,
  disconnect,
  clean,
}
