import { useState, useEffect, useCallback } from "react";
import { fetchPost } from "../services/api/postApi";

// 초기 페이지네이션 상태
const initialPagination = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// 초기 쿼리 파라미터
const initialQueryParams = {
  page: 1,
  limit: 10,
  boardType: null, // 기본 게시판 타입 설정
  search: "",
  sort: "latest",
};

export const usePosts = (defaultParams = {}) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 쿼리 파라미터 상태 (검색어, 페이지, 필터링 등)
  const [queryParams, setQueryParams] = useState({
    ...initialQueryParams,
    ...defaultParams,
  });

  const fetchPosts = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination: newPagination } = await fetchPost(params);
      setPosts(data);
      setPagination(newPagination);
    } catch (err) {
      console.error("게시글 데이터 로드 중 에러 발생:", err);
      setError("게시글 목록을 불러오는데 실패했습니다.");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(queryParams);
  }, [queryParams, fetchPosts]);

  const updateQueryParams = useCallback((newParams) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      ...newParams,
      // 페이지가 변경되지 않는 '검색'이나 '정렬' 변경 시, 페이지를 1로 리셋
      page:
        newParams.search !== undefined ||
        newParams.sort !== undefined ||
        newParams.boardType !== undefined
          ? 1
          : prevParams.page, // 페이지네이션만 변경 시에는 기존 페이지 유지
    }));
  }, []);

  // 수동 새로고침 함수 (예: 작성 후, 좋아요 누른 후)
  const refreshPosts = useCallback(() => {
    fetchPosts(queryParams);
  }, [queryParams, fetchPosts]);

  return {
    posts,
    pagination,
    isLoading,
    error,
    queryParams,
    setQueryParams: updateQueryParams,
    refreshPosts,
  };
};
