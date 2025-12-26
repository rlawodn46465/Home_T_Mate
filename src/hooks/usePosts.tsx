import { useState, useEffect, useCallback } from "react";
import { fetchPost } from "../services/api/postApi";
import type { PostListItem, Pagination, BoardType } from "../types/post";

interface QueryParams {
  page: number;
  limit: number;
  boardType: BoardType | null;
  search: string;
  sort: "latest" | "likes";
}

// 초기 페이지네이션 상태
const initialPagination: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// 초기 쿼리 파라미터
const initialQueryParams: QueryParams = {
  page: 1,
  limit: 10,
  boardType: null,
  search: "",
  sort: "latest",
};

export const usePosts = (defaultParams: Partial<QueryParams> = {}) => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 쿼리 파라미터 상태 (검색어, 페이지, 필터링 등)
  const [queryParams, setQueryParams] = useState<QueryParams>({
    ...initialQueryParams,
    ...defaultParams,
  });

  const fetchPosts = useCallback(async (params: QueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination: newPagination } = await fetchPost({
        ...params,
        boardType: params.boardType || undefined,
      });
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

  const updateQueryParams = useCallback((newParams: Partial<QueryParams>) => {
    setQueryParams((prevParams) => {
      // 페이지 리셋 여부 결정
      const shouldResetPage =
        newParams.search !== undefined ||
        newParams.sort !== undefined ||
        newParams.boardType !== undefined;

      return {
        ...prevParams,
        ...newParams,
        page: shouldResetPage ? 1 : newParams.page ?? prevParams.page,
      };
    });
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
