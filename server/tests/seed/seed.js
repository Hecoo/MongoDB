let { ObjectID } = require("mongodb");
let { Todomodel } = require("./../../models/todo");
let { userLogin } = require("./../../models/userLogin");
let jwt = require("jsonwebtoken");

let userOneId = new ObjectID();
let userTwoId = new ObjectID();
let insertedUsers = [
  {
    _id: userOneId,
    email: "Mohsen@example.com",
    password: "userOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId, access: "auth" }, "abc123")
          .toString(),
      },
    ],
  },
  {
    _id: userTwoId,
    email: "Jen@example.com",
    password: "userTwoPass",
  },
];

let insertedtodos = [
  {
    _id: new ObjectID(),
    text: "first test todo",
  },
  {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333,
  },
];

let wipingDB = (done) => {
  Todomodel.remove({})
    .then(() => {
      return Todomodel.insertMany(insertedtodos);
    })
    .then(() => {
      done();
    });
};

let wipingDB_users = (done) => {
  userLogin
    .remove({})
    .then(() => {
      let userOne = new userLogin(insertedUsers[0]).save();
      let userTwo = new userLogin(insertedUsers[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => {
      done();
    });
};

module.exports = {
  insertedtodos,
  wipingDB,
  insertedUsers,
  wipingDB_users,
};
