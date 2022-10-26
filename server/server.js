let _ = require("lodash");
let express = require("express");
let bodyparser = require("body-parser");
let { ObjectID } = require("mongodb");

let { mongoose } = require("./db/mongoose.js");
let { Todomodel } = require("./models/todo");
const { userLogin } = require("./models/userLogin.js");
let { authenticate } = require("./Middleware/authenticate.js");

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyparser.json());

// app.post("/users", (req, res) => {
//   // console.log(req.body);
//   let newuser = new usermodel({
//     text: req.body.text,
//     completed: req.body.completed,
//     completedAt: req.body.completedAt,
//   });

//   newuser.save().then(
//     (result) => {
//       res.send(result);
//     },
//     (err) => {
//       res.status(400).send(err);
//     }
//   );
// });
app.post("/todo", authenticate, (req, res) => {
  // console.log(req.body);
  let newtodo = new Todomodel({
    text: req.body.text,
    _creator: req.user._id,
  });
  newtodo.save().then(
    (result) => {
      res.send(result);
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get("/todo", authenticate, (req, res) => {
  Todomodel.find({ _creator: req.user._id }).then(
    (result) => {
      res.send({ result, code: "232A" });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get("/todo/:id", authenticate, (req, res) => {
  let id = req.params.id;
  //valid id using is-valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    Todomodel.findOne({
      _id: id,
      _creator: req.user._id,
    }) // findOne
      .then((todo) => {
        if (todo) {
          res.send({ todo });
        } else {
          res.status(404).send();
        }
      })
      .catch((err) => {
        res.send({});
      });
  }
});

app.delete("/todo/:id", authenticate, async (req, res) => {
  try {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    let result = await Todomodel.findOneAndRemove({
      _id: id,
      _creator: req.user._id,
    });
    if (!result) {
      return res.status(404).send();
    }
    res.send({ result });
  } catch (err) {
    res.status(400).send();
  }
});

app.patch("/todo/:id", authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["text", "completed"]); // let the user update the things we choose
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    if (_.isBoolean(body.completed) && body.completed) {
      // updated the completedAt property based on completed property
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
    Todomodel.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
      { $set: body },
      { new: true }
    )
      .then((todo) => {
        if (todo) {
          res.status(200).send({ todo });
        } else {
          res.status(404).send();
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  }
});

// For sign up users
app.post("/userLogin", async (req, res) => {
  // console.log(req.body);
  try {
    let body = _.pick(req.body, ["email", "password"]);
    let user = new userLogin(body);
    await user.save();
    let token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/userLogin/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/userLogin/Login", async (req, res) => {
  try {
    let body = _.pick(req.body, ["email", "password"]);
    let user = await userLogin.findByCredentials(body.email, body.password);
    let token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (err) {
    res.status(400).send();
  }
});

app.delete("/userLogin/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (err) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`app is listening  on port ${port}`);
});

module.exports = {
  app,
};
