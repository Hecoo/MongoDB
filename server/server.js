let express = require("express");
let bodyparser = require("body-parser");
let { ObjectID } = require("mongodb");

let { mongoose } = require("./db/mongoose.js");
let { Todomodel } = require("./models/todo");
let { usermodel } = require("./models/Users.js");

let app = express();
let port = process.env.PORT || 3000;
console.log(process.env);

app.use(bodyparser.json());

app.post("/users", (req, res) => {
  // console.log(req.body);
  let newuser = new usermodel({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt,
  });

  newuser.save().then(
    (result) => {
      res.send(result);
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

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

app.listen(port, () => {
  console.log(`app is listening  on port ${port}`);
});

module.exports = {
  app,
};
// let newUsermodel = new usermodel({ text: "Playing Football" });

// newUsermodel.save().then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );

// //////////////////////////////////////////////////////////////////////////

// let newModel_2 = new usermodel({ text: "Baby Cool" }); // creating new instance

// newModel_2.save().then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log(err);
//   }
// );
