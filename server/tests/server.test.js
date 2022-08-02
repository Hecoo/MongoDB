let expect = require("expect");
let request = require("supertest");
let { ObjectID } = require("mongodb");

let { app } = require("./../server.js");
let { Todomodel } = require("./../models/todo.js");

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

//to make sure that the database is empty
//we're gonna tweak it for abit so we can insert the GET test
beforeEach((done) => {
  Todomodel.remove({})
    .then(() => {
      return Todomodel.insertMany(insertedtodos);
    })
    .then(() => {
      done();
    });
});

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
