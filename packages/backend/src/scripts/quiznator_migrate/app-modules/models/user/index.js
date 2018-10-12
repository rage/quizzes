const mongoose = require("mongoose")

const validators = require("../../utils/validators")

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      minlength: 3,
      maxlength: 50,
      validate: {
        validator: validators.validateEmail,
        msg: "`{VALUE} is not a valid email address`",
      },
    },
    passwordHash: { type: String },
  },
  { timestamps: true },
)

require("./methods")(schema)

module.exports = mongoose.model("User", schema)
