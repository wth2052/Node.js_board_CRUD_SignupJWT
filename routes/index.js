const express = require("express");
const postRouter = require("./posts");

const commentRouter = require("./comments");

const router = express.Router();

router.use('/posts', postRouter);
router.use('/comments', commentRouter);

module.exports = router;