// controllers/postController.js
const asyncHandler = require("../utils/asyncHandler");
const postService = require("../services/postService");
const { successResponse } = require("../utils/response");

// GET /api/v1/posts (게시글 조회)
const getPosts = asyncHandler(async (req, res) => {
  const result = await postService.getPosts(req.query);

  return successResponse(res, result.posts, {
    pagination: result.pagination,
  });
});

// POST /api/v1/posts (게시글 작성)
const createPost = asyncHandler(async (req, res) => {
  const newPost = await postService.createPost(req.user._id, req.body);
  return successResponse(
    res,
    { id: newPost._id },
    { message: "게시글이 등록되었습니다." }
  );
});

// GET /api/v1/posts/:postId (게시글 상세 조회)
const getPostDetail = asyncHandler(async (req, res) => {
  const post = await postService.getPostDetail(
    req.params.postId,
    req.user?._id ?? null
  );
  return successResponse(res, post);
});

// POST /api/v1/posts/:postId/like (좋아요 토글)
const toggleLike = asyncHandler(async (req, res) => {
  const result = await postService.toggleLike(req.params.postId, req.user._id);
  return successResponse(res, result);
});

// POST /api/v1/posts/:postId/download-goal (목표 다운로드)
const downloadGoalFromPost = asyncHandler(async (req, res) => {
  const result = await postService.downloadGoalFromPost(
    req.params.postId,
    req.user._id
  );
  return successResponse(res, result);
});

// PUT /api/v1/posts/:postId (게시글 수정)
const updatePost = asyncHandler(async (req, res) => {
  const result = await postService.updatePost(
    req.params.postId,
    req.user._id,
    req.body
  );
  return successResponse(res, result);
});

// DELETE /api/v1/posts/:postId (게시글 삭제)
const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user._id);
  return successResponse(res, null, { message: "게시글이 삭제되었습니다." });
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
