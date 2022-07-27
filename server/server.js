let express = require("express");
let bodyparser = require("body-parser");

let { mongoose } = require("./db/mongoose.js");
let { Todomodel } = require("./models/todo");
let { usermodel } = require("./models/Users");

let app = express();

app.use(bodyparser.json());

app.post("/todo", (req, res) => {
  //   console.log(req.body);
  let newtodo = new Todomodel({
    text: req.body.text,
  });
  newtodo.save().then(
    (res) => {
      res.send(res);
    },
    (err) => {
      res.send(err);
    }
  );
});

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});

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
