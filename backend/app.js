var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var sportsRouter = require("./routes/sports");
var sportsCentersRouter = require("./routes/sports_centers");
var courtsRouter = require("./routes/courts");
var vouchersRouter = require("./routes/vouchers");
var bookingsRouter = require("./routes/bookings");
var reviewsRouter = require("./routes/reviews");

// 1. khởi tạo ứng dụng Express
var app = express();

// 2. Kết nối database
var mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Kết nối thành công, đang chạy trên port: " + process.env.PORT);
  })
  .catch((error) => {
    console.log("Kết nối thất bại!", error);
  });
// 2.1 test db
// var UserModel = require("./models/Demo");
// let user1 = new UserModel({ name: "quang vip pro" });
// user1.save();

// 3. cấu hình CORS - kiểm tra whiteList
var cors = require("cors");
var allowlist = [
  process.env.PORT_FRONT_END_1,
  process.env.PORT_FRONT_END_2,
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;

  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 4 . cấu hình view Engine
var configViewEngine = require("./config/viewEngine");
configViewEngine(app);

// 5. định nghĩa route
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/sports-centers", sportsCentersRouter);
app.use("/api/courts", courtsRouter);
app.use("/api/vouchers", vouchersRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
