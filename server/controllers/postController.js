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

module.exports = {
  getPosts,
};
