let jwt = require("jsonwebtoken");
let express = require("express");
let cookieParser = require("cookie-parser");

let auth = async (req, res, next) => {
   try {
      let token = req.cookies.jwt_login;

      if (!token) {
         return res.status(401).render("login", { message: "Please log in to continue" });
      }

      let userEmail = jwt.verify(token, process.env.SECRET_KEY);

      req.email = userEmail; // Attach the user's email to the request object

      next(); // Proceed to the next middleware or route handler

   } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).render("login", { message: "Session expired, please log in again" });
   }
};

module.exports = auth;
