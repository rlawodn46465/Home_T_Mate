// routes/posts.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); // 로그인한 사용자만 볼 수 있다고 가정 (필요 시 제거 가능)
const { getPosts, createPost } = require("../controllers/postController");

// 게시글 목록 조회 (검색, 페이징, 카테고리 필터 포함)
// GET /api/v1/posts?boardType=free&page=1&limit=10&search=검색어
router.get("/", protect, getPosts);

// 게시글 작성 (POST /api/v1/posts)
router.post("/", protect, createPost);

module.exports = router;
