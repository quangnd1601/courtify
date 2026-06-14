// 1. Kết nối database
var express = require("express");
var mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/WD21101")
  .then(() => {
    console.log("Kết nối thành công!");
  })
  .catch((error) => {
    console.log("Kết nối thất bại!", error);
  });
