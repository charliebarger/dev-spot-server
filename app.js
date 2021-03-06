require("dotenv").config();
require("./server/models/database");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const passport = require("passport");
require("./server/passport");
var logger = require("morgan");
const postRouter = require("./server/routes/posts");
const userRouter = require("./server/routes/users");
const draftRouter = require("./server/routes/drafts");
var app = express();
const cors = require("cors");
var multer = require("multer");
var upload = multer();
app.use(passport.initialize());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(upload.array());

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/drafts", draftRouter);
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
  res.json({ error: true });
});

module.exports = app;
