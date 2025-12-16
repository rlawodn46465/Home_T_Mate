import api from "./api";

const API_POST_PATH = "/api/v1/posts";

// 게시글 목록 조회
export const fetchPost = async (params = {}) => {
  const response = await api.get(API_POST_PATH, {
    params: params,
  });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// 게시글 작성
export const createPost = async (postData) => {
  const response = await api.post(API_POST_PATH, postData);

  return response.data.data;
};