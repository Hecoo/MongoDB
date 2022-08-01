let { ObjectID } = require("mongodb");
let { mongoose } = require("./../server/db/mongoose.js");
let { Todomodel } = require("./../server/models/todo.js");
let { usermodel } = require("./../server/models/Users.js");

let id = "62e0f2dc4640deac33f6500f";

if (!ObjectID.isValid(id)) {
  console.log("ID Not valid");
}

// usermodel.find({ _id: id }).then((todo) => {
//   console.log("Todo", todo);
// }); // with the JSON.Stringify you can take the data and turn it into JSON usefull data

usermodel.find({ _id: id }).then((todo) => {
  console.log("Todo", JSON.stringify(todo, undefined, 2));
});

usermodel
  .findOne({
    _id: id,
  })
  .then((todo) => {
    console.log("todo", JSON.stringify(todo, undefined, 2));
  });

usermodel
  .findById(id)
  .then((todo) => {
    if (!todo) {
      return console.log("id Not Found");
    }
    console.log("todo By Id", JSON.stringify(todo, undefined, 2));
  })
  .catch((err) => {
    console.log(err);
  });
