const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { BadRequestError, NotFoundError } = require("../utils/errorHandler");

// 댓글 목록 조회
const getCommentsByPost = async (postId) => {
  const comments = await Comment.find({ post: postId })
    .populate("author", "nickname _id")
    .sort({ createdAt: 1 })
    .lean();

  return comments.map((comment) => ({
    id: comment._id,
    content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
    author: comment.author
      ? { id: comment.author._id, nickname: comment.author.nickname }
      : { id: null, nickname: "알 수 없음" },
    isDeleted: comment.isDeleted,
    createdAt: comment.createdAt,
  }));
};

// 댓글 작성
const createComment = async (postId, userId, content) => {
  if (!content || content.trim() === "") {
    throw new BadRequestError("댓글 내용을 입력하세요.");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "author",
    "nickname _id"
  );

  if (!populatedComment) {
    throw new Error("댓글 생성 후 데이터를 불러오는 데 실패했습니다.");
  }

  // 댓글 수 증가
  post.commentCount += 1;
  await post.save();

  return {
    id: populatedComment._id,
    content: populatedComment.content,
    author: {
      id: populatedComment.author?._id?.toString() || userId.toString(),
      nickname: populatedComment.author?.nickname || "사용자",
    },
    isDeleted: populatedComment.isDeleted,
    createdAt: populatedComment.createdAt,
  };
};

// 댓글 삭제 (소프트 삭제)
const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다.");
  }

  if (comment.author.toString() !== userId.toString()) {
    throw new BadRequestError("본인 댓글만 삭제할 수 있습니다.");
  }

  if (comment.isDeleted) return;

  comment.isDeleted = true;
  await comment.save();

  // 게시글 댓글 수 감소
  await Post.findByIdAndUpdate(comment.post, {
    $inc: { commentCount: -1 },
  });
};

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};
