const errors = require("../../errors")

function assignAttributes(object, attributes) {
  Object.keys(attributes).forEach(attribute => {
    object[attribute] = attributes[attribute]
  })
}

function extendSchema(schema) {
  schema.statics.updateWithValidation = function(query, update) {
    return errors
      .withExistsOrError(new errors.NotFoundError())(this.findOne(query))
      .then(object => {
        assignAttributes(object, update)

        return object.save()
      })
      .then(object => {
        return object
      })
  }
}

module.exports = { extendSchema, assignAttributes }
