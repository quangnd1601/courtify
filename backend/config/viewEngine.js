const express = require("express");
const path = require("path");

const configViewEngine = (app) => {
  // 4. view engine setup
  app.set("views", path.join("", "views"));
  app.set("view engine", "ejs");

  // static file
  app.use(express.static(path.join("", "public")));
};

module.exports = configViewEngine;
