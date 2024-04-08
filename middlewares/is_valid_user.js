//This mw function is used to verify the user via validating JWT Token use this for every http request by user
const jwt = require("jsonwebtoken");
// require("dotenv").config();

module.exports = function authenticate(request, response, next) {
  let jwtToken;
  const authHeader = request.headers["authorization"];

  if (authHeader != undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    response.status(401).send("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, process.env.jwtSecretKey, async (error, payload) => {
      if (error) {
        response.status(401).send("Invalid Access Token");
      } else {
        request.roll_no = payload.roll_no;
        next();
      }
    });
  }
};