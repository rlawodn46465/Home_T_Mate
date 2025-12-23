// routes/comments.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getCommentsByPost,
  createComment,
  deleteComment,
} = require("../controllers/commentController");

// 댓글 조회 (GET /api/v1/posts/:postId/comments)
router.get("/posts/:postId", getCommentsByPost);

// 댓글 작성 (POST /api/v1/posts/:postId/comments)
router.post("/posts/:postId", protect, createComment);

// 댓글 삭제 (DELETE /api/v1/comments/:commentId)
router.delete("/:commentId", protect, deleteComment);

module.exports = router;