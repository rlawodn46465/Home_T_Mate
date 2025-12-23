// controllers/commentController.js

const asyncHandler = require("../utils/asyncHandler");
const commentService = require("../services/commentService");
const { successResponse } = require("../utils/response");

// 댓글 목록
const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await commentService.getCommentsByPost(postId);

  return successResponse(res, comments);
});

// 댓글 작성
const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  const comment = await commentService.createComment(postId, userId, content);

  return successResponse(res, comment);
});

// 댓글 삭제 (소프트 삭제)
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  await commentService.deleteComment(commentId, userId);

  return successResponse(res, null, { message: "댓글이 삭제되었습니다." });
});

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};
