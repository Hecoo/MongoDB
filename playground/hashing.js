let { SHA256 } = require("crypto-js");

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

// let password = "123abc";

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

// let hashedPassword =
//   "$2a$10$FWq/4vSV5IS9QGpbh28sru.9/HjMj.n0XZ0p/2nDHRgrmpEyiBYKK";

// bcrypt.compare(password, hashedPassword, (err, res) => {
//   console.log(res);
// });

let data = {
  id: 10,
};

let token = jwt.sign(data, "ABC"); // it takes the data and the secret and create that hashed token
console.log("token :", token);

let decodedResult = jwt.verify(token, "ABC"); // it takes that token and the secret to make sure that the data was not manipulation
console.log(decodedResult); // iat-> issued at

// we can use sha256 and do these of the stuff but we could use JWT library
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
