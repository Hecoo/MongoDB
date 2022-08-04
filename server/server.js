let _ = require("lodash");
let express = require("express");
let bodyparser = require("body-parser");
let { ObjectID } = require("mongodb");

let { mongoose } = require("./db/mongoose.js");
let { Todomodel } = require("./models/todo");
let { usermodel } = require("./models/Users.js");
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
app.post("/todo", (req, res) => {
  // console.log(req.body);
  let newtodo = new Todomodel({
    text: req.body.text,
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

app.get("/todo", (req, res) => {
  Todomodel.find().then(
    (result) => {
      res.send({ result, code: "232A" });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

app.get("/todo/:id", (req, res) => {
  let id = req.params.id;
  //valid id using is-valid
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    Todomodel.findById(id) // findById
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

app.delete("/todo/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  } else {
    Todomodel.findByIdAndRemove(id)
      .then((result) => {
        if (result) {
          res.send({ result });
        } else {
          res.status(404).send();
        }
      })
      .catch((err) => {
        res.send();
      });
  }
});

app.patch("/todo/:id", (req, res) => {
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
    Todomodel.findByIdAndUpdate(id, { $set: body }, { new: true })
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

app.post("/userLogin", (req, res) => {
  // console.log(req.body);
  let body = _.pick(req.body, ["email", "password"]);
  let user = new userLogin(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header("x-auth", token).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/userLogin/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`app is listening  on port ${port}`);
});

module.exports = {
  app,
};
