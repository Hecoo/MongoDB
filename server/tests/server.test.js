let expect = require("expect");
let request = require("supertest");
let { ObjectID } = require("mongodb");

let { app } = require("./../server.js");
let { Todomodel } = require("./../models/todo.js");
let {
  insertedtodos,
  wipingDB,
  insertedUsers,
  wipingDB_users,
} = require("./seed/seed");
const { userLogin } = require("../models/userLogin");

//to make sure that the database is empty
//we're gonna tweak it for abit so we can insert the GET test
beforeEach(wipingDB_users);
beforeEach(wipingDB);

describe("POST /todo", () => {
  it("should create a new todo", (done) => {
    let text = "test todo text";
    request(app)
      .post("/todo")
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Todomodel.find({ text: text })
            .then((result) => {
              expect(result.length).toBe(1);
              expect(result[0].text).toBe(text);
              done();
            })
            .catch((err) => {
              done(err);
            });
        }
      });
  });

  it("should not create todo with invalid body data", (done) => {
    request(app)
      .post("/todo")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          Todomodel.find()
            .then((result) => {
              expect(result.length).toBe(2);
              done();
            })
            .catch((err) => {
              done(err);
            });
        }
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", (done) => {
    request(app)
      .get("/todo")
      .expect(200)
      .expect((res) => {
        expect(res.body.result.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todo/:id", () => {
  it("should return todo doc", (done) => {
    request(app)
      .get(`/todo/${insertedtodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(insertedtodos[0].text);
      })
      .end(done);
  });
  it("should return 404 if todo not found ", (done) => {
    request(app)
      .get(`/todo/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it("should return 404 for non-object IDs", (done) => {
    request(app).get(`/todo/123ab7a`).expect(404).end(done);
  });
});

describe("Delete /todo/:id", () => {
  it("should delete the selected doc", (done) => {
    request(app)
      .delete(`/todo/${insertedtodos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.result._id).toBe(insertedtodos[1]._id.toHexString());
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todomodel.findById(insertedtodos[1]._id.toHexString())
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
  it("should return 404 if todo not found", (done) => {
    request(app)
      .delete(`/todo/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it("should return 404 for non-object IDs", (done) => {
    request(app).get(`/todo/213321abs`).expect(404).end(done);
  });
});

describe("Patch  /todo/:id ", () => {
  it("should update the todo", (done) => {
    let text = "this should be the new text";
    request(app)
      .patch(`/todo/${insertedtodos[0]._id.toHexString()}`)
      .send({ completed: true, text })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });
  it("should clear completedAt when todo is not completed", (done) => {
    let text = "this should be the new text!!";
    request(app)
      .patch(`/todo/${insertedtodos[1]._id.toHexString()}`)
      .send({ completed: false, text })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("/GET /userLogin/me", () => {
  it("should return user if authenticated", (done) => {
    request(app)
      .get("/userLogin/me")
      .set("x-auth", insertedUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(insertedUsers[0]._id.toHexString());
        expect(res.body.email).toBe(insertedUsers[0].email);
      })
      .end(done);
  });
  it("should return 401 if not authenticated", (done) => {
    request(app)
      .get("/userLogin/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /userLogin", () => {
  it("should create a user", (done) => {
    let email = "example@example.com";
    let password = "123mbc";
    request(app)
      .post("/userLogin")
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        userLogin
          .findOne({ email })
          .then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
  it("should return validation errors if request invalid", (done) => {
    let email = "and";
    let password = "123";
    request(app)
      .post("/userLogin")
      .send({ email, password })
      .expect(400)
      .end(done);
  });
  it("should not create user if email in use", (done) => {
    request(app)
      .post("/userLogin")
      .send({ email: insertedUsers[0].email, password: "password123" })
      .expect(400)
      .end(done);
  });
});

describe("POST  /userLogin/Login", () => {
  it("should login user and send auth back", (done) => {
    request(app)
      .post("/userLogin/Login")
      .send({
        email: insertedUsers[1].email,
        password: insertedUsers[1].password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userLogin
          .findById(insertedUsers[1]._id)
          .then((user) => {
            expect(user.tokens[0]).toInclude({
              access: "auth",
              token: res.headers["x-auth"],
            });
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
  it("should reject invalid login", (done) => {
    request(app)
      .post("/userLogin/Login")
      .send({
        email: insertedUsers[1].email,
        password: insertedUsers[1].password + 1,
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userLogin
          .findById(insertedUsers[1]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
});

describe("Deleting userLogin/me/token", () => {
  it("should delete the auth token on logout", (done) => {
    request(app)
      .delete("/userLogin/me/token")
      .set("x-auth", insertedUsers[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userLogin
          .findById(insertedUsers[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
});
