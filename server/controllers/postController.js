// controllers/postController.js
const asyncHandler = require("../utils/asyncHandler");
const postService = require("../services/postService");

// GET /api/v1/posts
const getPosts = asyncHandler(async (req, res) => {
  const result = await postService.getPosts(req.query);

  res.status(200).json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

// POST /api/v1/posts
const createPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newPost = await postService.createPost(userId, req.body);

  res.status(201).json({
    success: true,
    data: {
      id: newPost._id,
      message: "게시글이 성공적으로 등록되었습니다.",
    },
  });
});

module.exports = {
  getPosts,
  createPost,
};
