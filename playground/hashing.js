let { SHA256 } = require("crypto-js");

let jwt = require("jsonwebtoken");

let data = {
  id: 10,
};

let token = jwt.sign(data, "ABC");
console.log(token);

let decodedResult = jwt.verify(token, "ABC");
console.log(decodedResult);
// let message = "i'm user number 3";

// let hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);

// let data = {
//   id: 4,
// };

// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "someSecret").toString(),
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data).toString());

// let resultHash = SHA256(JSON.stringify(token.data) + "someSecret").toString();
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("data was changed. Do Not Trust");
// }
