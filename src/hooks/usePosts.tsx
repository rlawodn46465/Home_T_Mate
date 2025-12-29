import { useState, useEffect, useCallback, useMemo } from "react";
import {
  createPost,
  deletePost,
  downloadGoal,
  fetchPost,
  fetchPostDetail,
  togglePostLike,
  updatePost,
} from "../services/api/postApi";
import type {
  PostListItem,
  Pagination,
  BoardType,
  PostDetail,
  SavePostRequest,
} from "../types/post";
import { useAuth } from "./useAuth";
import { usePersistentPanel } from "./usePersistentPanel";

interface QueryParams {
  page: number;
  limit: number;
  boardType: BoardType | null;
  search: string;
  sort: "latest" | "likes";
}

// 초기 쿼리 파라미터
const initialQueryParams: QueryParams = {
  page: 1,
  limit: 10,
  boardType: null,
  search: "",
  sort: "latest",
};

// 초기 페이지네이션 상태
const initialPagination: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// 게시판 목록 조회 및 검색
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
    try {
      const { data, pagination: newPagination } = await fetchPost({
        ...params,
        boardType: params.boardType || undefined,
      });
      setPosts(data);
      setPagination(newPagination);
    } catch (err) {
      setError("게시글 목록을 불러오는데 실패했습니다.");
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

  return {
    posts,
    pagination,
    isLoading,
    error,
    queryParams,
    setQueryParams: updateQueryParams,
  };
};

// 게시글 상세 정보 및 액션 (좋아요, 삭제)
export const usePostDetail = (postId: string | undefined) => {
  const { user } = useAuth();
  const { navigateWithPanel } = usePersistentPanel();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 상세 정보 가져오기
  const getPost = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const data = await fetchPostDetail(postId);
      setPost(data);
    } catch (err: any) {
      setError(err.message || "게시글 로드 실패");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  // 좋아요 핸들러
  const handleToggleLike = useCallback(async () => {
    if (!post || !postId) return;

    // 낙관적 업데이트 (UI 먼저 반응)
    const prevPost = { ...post };
    const newIsLiked = !post.isLiked;
    const newLikeCount = newIsLiked ? post.likeCount + 1 : post.likeCount - 1;

    setPost((prev) =>
      prev ? { ...prev, isLiked: newIsLiked, likeCount: newLikeCount } : null
    );

    try {
      await togglePostLike(post.id);
      // 필요하다면 여기서 최신 데이터를 다시 fetch할 수도 있음
    } catch (err) {
      console.error("좋아요 실패:", err);
      // 실패 시 롤백
      setPost(prevPost);
      alert("좋아요 처리에 실패했습니다.");
    }
  }, [post, postId]);

  // 게시글 삭제 핸들러
  const handleDeletePost = useCallback(async () => {
    if (!post || !postId || !user) return;

    if (String(user.id) !== String(post.author.id)) {
      alert("게시글 삭제 권한이 없습니다.");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePost(postId);
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigateWithPanel("/community");
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert(err.message || "게시글 삭제에 실패했습니다.");
    }
  }, [postId, post, user, navigateWithPanel]);

  // 게시글 작성자 여부 판단
  const isAuthor = useMemo(() => {
    if (!post || !user) return false;

    const currentUserId = user.id || user.id;
    const authorId = post.author?.id;

    return String(currentUserId) === String(authorId);
  }, [post, user]);

  return {
    post,
    loading,
    error,
    handleToggleLike,
    handleDeletePost,
    isAuthor,
    refreshPost: getPost,
  };
};

// 게시글 생성 및 수정
export const usePostForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const savePost = async (
    postData: SavePostRequest,
    postId?: string | null
  ) => {
    setIsProcessing(true);
    try {
      return postId
        ? await updatePost(postId, postData)
        : await createPost(postData);
    } catch (err: any) {
      alert(err.response?.data?.message || "저장 중 오류 발생");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  return { savePost, isProcessing };
};

// 모표 다운로드
export const useGoalDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { navigateWithPanel } = usePersistentPanel();

  const handleDownload = async (postId: string, goalName: string) => {
    if (!window.confirm(`[${goalName}] 목표를 가져오시겠습니까?`)) return false;
    setIsDownloading(true);
    try {
      await downloadGoal(postId);
      if (window.confirm("가져오기 성공! 루틴 목록에서 확인하시겠습니까?")) navigateWithPanel("?panel=goal");
      return true;
    } catch (err: any) { alert(err.response?.data?.message || "다운로드 실패"); return false; }
    finally { setIsDownloading(false); }
  };
  return { handleDownload, isDownloading };
};