// let MongoClient = require("mongodb").MongoClient;
let { MongoClient, ObjectID } = require("mongodb");

// let obj = new ObjectID();
// console.log(obj);

//destructioning the object
// let obj = { name: "Mohamed", age: 28 };
// let { name } = obj;
// console.log(name);

MongoClient.connect("mongodb://127.0.0.1:27017/TodoApp", (err, db) => {
  if (err) {
    console.log("unable to connect to mongoDB Servers");
  } else {
    console.log("connected to MongoDB server");
  }
  db.collection("Todos").insertOne(
    {
      text: "Something to do",
      Completed: false,
    },
    (err, result) => {
      if (err) {
        console.log("unable to insert todo", err);
      } else {
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    }
  );
  //   db.collection("Users").insertOne(
  //     {
  //       name: "Mohamed",
  //       age: 28,
  //       location: "Egypt",
  //     },
  //     (err, result) => {
  //       if (err) {
  //         console.log("unable to insert the user", err);
  //       } else {
  //         console.log(JSON.stringify(result.ops[0]._id, undefined, 2));
  //       }
  //     }
  //   );
  db.close();
});
