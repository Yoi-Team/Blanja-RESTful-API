const db = require("../config/mySQL");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  postNewUser: (body) => {
    return new Promise((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          reject(err);
        }
        bcrypt.hash(body.password, salt, (err, hashedPassword) => {
          if (err) {
            reject(err);
          }
          const newBody = {
            ...body,
            password: hashedPassword,
          };
          const queryString = "INSERT INTO users SET ?";
          db.query(queryString, newBody, (err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(err);
            }
          });
        });
      });
    });
  },

  postLogin: (body) => {
    return new Promise((resolve, reject) => {
      const { username, password } = body;
      const queryString =
        "SELECT level_id, password, id FROM users where username = ?";
      db.query(queryString, username, (err, data) => {
        if (err) {
          reject({
            msg: "Error SQL",
            status: 500,
            err,
          });
        }
        // Handle User Not Found","
        if (!data[0]) {
          reject({
            msg: "User Not Found",
            status: 404,
          });
        } else {
          // console.log(data);
          bcrypt.compare(password, data[0].password, (err, result) => {
            if (err) {
              reject({
                msg: "Hash Error",
                status: 500,
                err,
              });
            }
            if (!result) {
              reject({
                msg: "Wrong Password",
                status: 401,
              });
            } else {
              const payload = {
                username: username,
                level_id: data[0].level_id,
                id: data[0].id,
              };
              // console.log(payload);
              const secret = process.env.SECRET_KEY;
              const token = jwt.sign(payload, secret);
              resolve({ token, username });
              console.log(data[0]);
            }
          });
        }
      });
    });
  },
};
