let mongoose = require("mongoose");
let validator = require("validator");
let jwt = require("jsonwebtoken");
let _ = require("lodash");
let bcrypt = require("bcryptjs");

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
      message: `this email is not a Valid`,
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
    .sign({ _id: user._id.toHexString(), access: access }, "abc123")
    .toString();
  user.tokens.push({ access: access, token: token });
  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  // for taking the auth token and verify it
  let User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, "abc123");
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject("Unauthorized");
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });
};
UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.methods.removeToken = function (token) {
  let user = this;
  return user.update({
    $pull: {
      tokens: {
        token: token,
      },
    },
  });
};

// Mongoose Middleware for hashing password before saving it to the database
UserSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let userLogin = mongoose.model("userlogin", UserSchema);

module.exports = {
  userLogin,
};

// diff between schema.static and methods both they add mehonds ...
// the .methods add methods onto the instance of that schema
// .static add methods onto the model of that schema itself
