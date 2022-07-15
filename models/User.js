const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const constant = require("../config/constant");

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    default: "",
    required: false,
  },
  firstName: {
    type: String,
    default: "",
    required: true,
  },
  lastName: {
    type: String,
    default: "",
    required: true,
  },
  email: {
    type: String,
    default: "",
    required: true,
    unique: true,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  emailConfirmed: {
    // Flag to know if the email is confirmed.
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    default: "",
    required: true,
  },
  streetAddress: {
    type: String,
    default: "",
    required: false,
  },
  city: {
    type: String,
    default: "",
    required: false,
  },
  state: {
    type: String,
    default: "",
    required: false,
  },
  zip: {
    type: String,
    default: "",
    required: false,
  },
  permissions: [
    {
      type: String,
      required: true,
      enum: constant.PERMISSIONS,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  profilePic: {
    type: String,
  },
});

// NOT USED ANYMORE vvvvvv
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
// NOT USED ANYMORE ^^^^^

module.exports = mongoose.model("User", UserSchema);
