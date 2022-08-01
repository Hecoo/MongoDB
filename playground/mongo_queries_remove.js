let { ObjectID } = require("mongodb");
let { mongoose } = require("../server/db/mongoose.js");
let { Todomodel } = require("../server/models/todo.js");
let { usermodel } = require("../server/models/Users.js");

// Todomodel.remove({})
usermodel.remove({}).then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
});

//findOneAndRemove
usermodel
  .findOneAndRemove({ _id: "62e84a27880299555a537121" })
  .then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

//FindByIdAndRemove
usermodel.findByIdAndRemove("62e848e8880299555a537110").then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
});
