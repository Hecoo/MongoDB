let mongoose = require("mongoose");
let validator = require("validator");
let jwt = require("jsonwebtoken");
let _ = require("lodash");

let UserSchema = new mongoose.Schema({
  //for adding custom methods we use schema
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{value} is not a Valid Email`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  // filtering the returning data
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function () {
  // for generating auth token
  let user = this;
  let access = "auth";
  let token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  user.tokens.push({ access, token });
  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  // for taking the auth token and verify it
  let userLogin = this;
  let decoded;
  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject("Unauthorized");
  }
  return userLogin.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });
};

let userLogin = mongoose.model("userlogin", UserSchema);

module.exports = {
  userLogin,
};
