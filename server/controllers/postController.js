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

// GET /api/v1/posts/:postId (게시글 상세 조회)
const getPostDetail = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await postService.getPostDetail(postId, userId);

  res.status(200).json({
    success: true,
    data: post,
  });
});

// POST /api/v1/posts/:postId/like (좋아요 토글)
const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const result = await postService.toggleLike(postId, userId);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// POST /api/v1/posts/:postId/download-goal (목표 다운로드)
const downloadGoalFromPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const result = await postService.downloadGoalFromPost(postId, userId);

  res.status(201).json({
    success: true,
    data: result,
  });
});

// PUT /api/v1/posts/:postId (게시글 수정)
const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const result = await postService.updatePost(postId, userId, req.body);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// DELETE /api/v1/posts/:postId (게시글 삭제)
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  await postService.deletePost(postId, userId);

  res.status(200).json({
    success: true,
    message: "게시글이 삭제되었습니다.",
  });
});

module.exports = {
  getPosts,
  createPost,
  getPostDetail,
  toggleLike,
  downloadGoalFromPost,
  updatePost,
  deletePost,
};
