const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const validationController = require("../controllers/validation");
const draftController = require("../controllers/draftController");

//GET all drafts
router.get("/myDrafts", draftController.getDraftsByUser);

//GET single draft
router.get("/:id", postController.getSingleDraft);

//POST draft
router.post(
  "/",
  postController.sanitizePostBody,
  postController.validateDraft(),
  validationController.checkFormForErrors,
  postController.creatIt
);

//PUT edit draft
router.put("/update/:id", postController.updatePost);

//DELETE single draft
router.delete("/delete/:id", postController.deletePost);

module.exports = router;