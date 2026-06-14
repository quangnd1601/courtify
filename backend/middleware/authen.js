var express = require("express");

var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authen = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.user = data.user;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authen;
