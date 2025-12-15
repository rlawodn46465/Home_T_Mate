// models/Post.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    // 1. 게시글 기본 정보
    title: { type: String, required: true }, // 제목
    content: { type: String, required: true }, // 내용 (HTML 혹은 텍스트)
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 작성자

    // 2. 게시판 종류 (자유게시판: free, 운동게시판: exercise)
    boardType: {
      type: String,
      enum: ["free", "exercise"],
      required: true,
      index: true, // 게시판별 조회를 위한 인덱스
    },

    // 3. 목표 공유 기능 (운동게시판 등에서 목표를 첨부했을 경우)
    linkedGoal: { type: Schema.Types.ObjectId, ref: "Goal" }, // 공유할 목표 ID
    shareCount: { type: Number, default: 0 }, // 다른 사용자가 이 목표를 가져간 횟수

    // 4. 인터랙션 정보
    viewCount: { type: Number, default: 0 }, // 조회수
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // 좋아요 누른 유저 목록

    // 5. 이미지 (업로드된 이미지 경로들)
    images: [String],

    // 댓글 수 (목록에서 댓글 수를 바로 보여주기 위해 캐싱하는 필드, 선택사항이지만 성능상 추천)
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 텍스트 검색을 위한 인덱스 (제목 + 내용)
PostSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", PostSchema);
