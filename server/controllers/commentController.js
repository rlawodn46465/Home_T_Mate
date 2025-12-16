const asyncHandler = require("../utils/asyncHandler");
const commentService = require("../services/commentService");

// 댓글 목록
const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await commentService.getCommentsByPost(postId);

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// 댓글 작성
const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  const comment = await commentService.createComment(postId, userId, content);

  res.status(201).json({
    success: true,
    data: comment,
  });
});

// 댓글 삭제 (소프트 삭제)
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  await commentService.deleteComment(commentId, userId);

  res.status(200).json({
    success: true,
    message: "댓글이 삭제되었습니다.",
  });
});

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};
