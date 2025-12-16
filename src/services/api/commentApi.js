import api from "./api"; // 기본 API 인스턴스

const API_COMMENT_PATH = "/api/v1/comments";

// 게시글의 댓글 목록 조회
export const fetchComments = async (postId) => {
  const response = await api.get(`${API_COMMENT_PATH}/posts/${postId}`);
  return response.data.data;
};

// 댓글 작성
export const createComment = async (postId, commentData) => {
  const response = await api.post(
    `${API_COMMENT_PATH}/posts/${postId}`,
    commentData
  );
  return response.data.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const response = await api.delete(`${API_COMMENT_PATH}/${commentId}`);
  return response.data;
};
