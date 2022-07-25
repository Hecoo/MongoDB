// let MongoClient = require("mongodb").MongoClient;
let { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://127.0.0.1:27017/TodoApp", (err, db) => {
  if (err) {
    console.log("unable to connect to mongoDB Servers");
  } else {
    console.log("connected to MongoDB server");
  }

  // db.collection("Users")
  //   .find({ _id: new ObjectID("62de85e422a27b42f2fbf634") })
  //   .toArray()
  //   .then(
  //     (res) => {
  //       console.log("User list");
  //       console.log(JSON.stringify(res, undefined, 2));
  //     },
  //     (err) => {
  //       console.log("unable to find the fetched Data", err);
  //     }
  //   );

  // db.collection("Users")
  //   .find()
  //   .count()
  //   .then(
  //     (count) => {
  //       console.log("User Count :", count);
  //     },
  //     (err) => {
  //       console.log("unable to find the fetched Data", err);
  //     }
  //   );

  db.collection("Users")
    .find({ name: "Mohamed" })
    .count()
    .then(
      (res) => {
        console.log(`Users of the selected Property :${res}`);
      },
      (err) => {
        console.log("Unable to fetch this data", err);
      }
    );

  db.collection("Users")
    .find({ name: "Mohamed" })
    .toArray()
    .then(
      (res) => {
        console.log(`Users List`);
        console.log(JSON.stringify(res, undefined, 2));
      },
      (err) => {
        console.log("Unable to fetch this data", err);
      }
    );
  // db.close();
});
