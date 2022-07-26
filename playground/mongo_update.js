// let MongoClient = require("mongodb").MongoClient;
let { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://127.0.0.1:27017/TodoApp", (err, db) => {
  if (err) {
    console.log("unable to connect to mongoDB Servers");
  } else {
    console.log("connected to MongoDB server");
  }

  //findOneAndUpdate
  db.collection("Users")
    .findOneAndUpdate(
      { _id: new ObjectID("62de85e422a27b42f2fbf634") },
      { $set: { completed: true } },
      { returnOriginal: false }
    )
    .then((res) => {
      console.log(res);
    });

  db.collection("Users")
    .findOneAndUpdate(
      { _id: new ObjectID("62dff8d622a27b42f2fbf6e7") },
      { $inc: { age: 4 } },
      { returnOriginal: false }
    )
    .then((res) => {
      console.log(res);
    });
  // db.close();
});
