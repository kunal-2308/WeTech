let jwt = require("jsonwebtoken");
let express = require("express");
let cookieParser = require("cookie-parser");
let auth = async(req, res, next) => {
   try {
      let token = req.cookies.jwt_login;

      if (!token) {
         res.status(401).send("Login Again");
      }

      let userEmail = jwt.verify(token, process.env.SECRET_KEY);

      req.email = userEmail;

      next();
      
   } catch (error) {
      console.log(error);
   }
};
auth();
module.exports = auth;
