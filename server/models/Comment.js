// models/Comment.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // 어떤 게시글인지
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 작성자
    content: { type: String, required: true }, // 댓글 내용

    isDeleted: { type: Boolean, default: false }, // 소프트 삭제 (삭제된 댓글입니다 표시용)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);