const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const postController = require('../controllers/posts');

router.post("", checkAuth, extractFile, postController.createPost);
router.put("/:id", checkAuth, extractFile, postController.putPost);
router.get("", postController.getPosts);
router.get("/:id", postController.getPost);
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
