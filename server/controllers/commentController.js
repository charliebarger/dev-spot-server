const commentDb = require("../models/commentModel");
const { check } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;
const passport = require("passport");

//Create a comment if user is logged in
exports.createComment = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      const addToDB = async () => {
        try {
          const post = await commentDb({
            user: user._id,
            comment: req.body.comment,
            post: ObjectId(req.params.postId),
          });
          await commentDb.create(post);
          return res.status(200).send({ status: "post added" });
        } catch (error) {
          return res.status(401).json(error);
        }
      };
      addToDB();
    }
  })(req, res);
};

//Get all posts
exports.getComments = async (req, res, next) => {
  try {
    const comments = await commentDb
      .find({ post: ObjectId(req.params.postId) })
      .sort({ timestamp: -1 })
      .populate("user");
    res.json(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//Update post (currently not supported)
exports.updatePost = async (req, res, next) => {
  try {
    const updatedComment = await commentDb.findByIdAndUpdate(
      ObjectId(req.params.id),
      {
        $set: {
          comment: req.body.comment,
        },
      }
    );
    res.json({ updatedComment });
  } catch (error) {
    next(error);
  }
};

//Express Validator (Form Vaidation)

//Validate comments
exports.validateComment = () => {
  return check("comment", "title is required").notEmpty().isString().trim();
};

exports.deleteComment = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: err[1].msg,
      });
    } else {
      (async () => {
        try {
          const data = await commentDb
            .findById(req.params.commentId)
            .populate("user");
          const author = data.user._id;
          if (author == user.id) {
            await commentDb.findByIdAndDelete(req.params.commentId);
            res.json({ status: "deleted" });
          } else {
            throw new Error("Not Authorized");
          }
        } catch (error) {
          res.status(401).send(error);
        }
      })();
    }
  })(req, res);
};
