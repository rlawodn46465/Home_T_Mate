import api from "./api"; // 기본 API 인스턴스
import type { Comment, CreateCommentData } from "../../types/comment";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const API_COMMENT_PATH = "/api/v1/comments";

// 게시글의 댓글 목록 조회
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await api.get<ApiResponse<Comment[]>>(
    `${API_COMMENT_PATH}/posts/${postId}`
  );
  return response.data.data;
};

// 댓글 작성
export const createComment = async (
  postId: string,
  commentData: CreateCommentData
): Promise<Comment> => {
  const response = await api.post<ApiResponse<Comment>>(
    `${API_COMMENT_PATH}/posts/${postId}`,
    commentData
  );
  return response.data.data;
};

// 댓글 삭제
export const deleteComment = async (
  commentId: string
): Promise<{ message: string }> => {
  const response = await api.delete<ApiResponse<null>>(
    `${API_COMMENT_PATH}/${commentId}`
  );
  return { message: response.data.message || "댓글이 삭제되었습니다." };
};
