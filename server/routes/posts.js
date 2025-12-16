// routes/posts.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); // 로그인한 사용자만 볼 수 있다고 가정 (필요 시 제거 가능)
const {
  getPosts,
  createPost,
  getPostDetail,
  toggleLike,
  downloadGoalFromPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// 게시글 목록 조회 (검색, 페이징, 카테고리 필터 포함)
// GET /api/v1/posts?boardType=free&page=1&limit=10&search=검색어
router.get("/", protect, getPosts);

// 게시글 작성 (POST /api/v1/posts)
router.post("/", protect, createPost);

// 게시글 수정 (PUT /api/v1/posts/:postId)
router.put("/:postId", protect, updatePost);

// 게시글 삭제 (DELETE /api/v1/posts/:postId)
router.delete("/:postId", protect, deletePost);

// 게시글 상세 조회 (GET /api/v1/posts/:postId)
router.get("/:postId", protect, getPostDetail);

// 게시글 좋아요 (POST /api/v1/posts/:postId/like)
router.post("/:postId/like", protect, toggleLike);

// 운동 다운로드 (POST /api/v1/posts/:postId/download-goal)
router.post("/:postId/download-goal", protect, downloadGoalFromPost);

module.exports = router;
