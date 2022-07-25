// let MongoClient = require("mongodb").MongoClient;
let { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://127.0.0.1:27017/TodoApp", (err, db) => {
  if (err) {
    console.log("unable to connect to mongoDB Servers");
  } else {
    console.log("connected to MongoDB server");
  }

  //deleteMany

  //   db.collection("Users")
  //     .deleteMany({ name: "Mohamed" })
  //     .then((res) => {
  //       console.log(res);
  //     });
  db.collection("Users")
    .findOneAndDelete({
      _id: new ObjectID("62dd315d51bbc037242b4f3b"),
    })
    .then((res) => {
      console.log(res);
    });

  //   db.collection("Todo")
  //     .deleteMany({ text: "Eating Lunch" })
  //     .then(
  //       (res) => {
  //         console.log(res);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );

  //deleteOne

  //   db.collection("Todo")
  //     .deleteOne({ text: "Food is good" })
  //     .then(
  //       (res) => {
  //         console.log(res);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );

  //findOneAndDelete

  //   db.collection("Todo")
  //     .findOneAndDelete({ completed: true })
  //     .then((res) => {
  //       console.log(res);
  //     });

  // db.close();
});
