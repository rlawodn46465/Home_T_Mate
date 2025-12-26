import api from "./api";
import type {
  PostListItem,
  PostDetail,
  SavePostRequest,
  Pagination,
  BoardType,
} from "../../types/post";

interface FetchPostsParams {
  page?: number;
  limit?: number;
  boardType?: BoardType;
  search?: string;
  sort?: "latest" | "likes";
}

const API_POST_PATH = "/api/v1/posts";

// 게시글 목록 조회
export const fetchPost = async (params: FetchPostsParams = {}) => {
  const response = await api.get<{
    data: PostListItem[];
    pagination: Pagination;
  }>(API_POST_PATH, { params });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// 게시글 작성
export const createPost = async (
  postData: SavePostRequest
): Promise<{ id: string }> => {
  const response = await api.post<{ data: { id: string } }>(
    API_POST_PATH,
    postData
  );
  return response.data.data;
};

// 게시글 삭제
export const deletePost = async (
  postId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`${API_POST_PATH}/${postId}`);
  return response.data;
};

// 게시글 수정
export const updatePost = async (
  postId: string,
  postData: Partial<SavePostRequest>
): Promise<{ postId: string; message: string }> => {
  const response = await api.put<{ data: { postId: string; message: string } }>(
    `${API_POST_PATH}/${postId}`,
    postData
  );
  return response.data.data;
};

// 게시글 상세 보기
export const fetchPostDetail = async (postId: string): Promise<PostDetail> => {
  const response = await api.get<{ data: PostDetail }>(
    `${API_POST_PATH}/${postId}`
  );
  return response.data.data;
};

// 게시글 좋아요 토글
export const togglePostLike = async (
  postId: string
): Promise<{ postId: string; isLiked: boolean; likeCount: number }> => {
  const response = await api.post<{
    data: { postId: string; isLiked: boolean; likeCount: number };
  }>(`${API_POST_PATH}/${postId}/like`);
  return response.data.data;
};

// 게시글에서 공유된 목표를 내 목표로 가져오기
export const downloadGoal = async (
  postId: string
): Promise<{
  userGoalId: string;
  goalId: string;
  goalName: string;
  message: string;
}> => {
  const response = await api.post<{
    data: {
      userGoalId: string;
      goalId: string;
      goalName: string;
      message: string;
    };
  }>(`${API_POST_PATH}/${postId}/download-goal`);
  return response.data.data;
};
