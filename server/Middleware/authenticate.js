//MiddleWare to use it in every http request you want

let { userLogin } = require("./../models/userLogin");
let authenticate = (req, res, next) => {
  let token = req.header("x-Auth");
  userLogin
    .findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

module.exports = {
  authenticate,
};
