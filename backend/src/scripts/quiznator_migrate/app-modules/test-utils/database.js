const mongoose = require("mongoose")
const Promise = require("bluebird")

mongoose.Promise = Promise

Promise.promisifyAll(require("mongodb"))

const mongoClient = Promise.promisifyAll(require("mongodb").MongoClient)

function connect() {
  return Promise.promisify(mongoose.connect, { context: mongoose })(
    process.env.MONGO_URI,
  )
}

function disconnect() {
  return Promise.promisify(mongoose.disconnect, { context: mongoose })()
}

function clean() {
  return mongoClient.connectAsync(process.env.MONGO_URI).then(db => {
    return db.dropDatabaseAsync().then(() => db.closeAsync())
  })
}

module.exports = {
  connect,
  disconnect,
  clean,
}
