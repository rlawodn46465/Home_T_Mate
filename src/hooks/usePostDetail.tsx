import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchPostDetail,
  togglePostLike,
  deletePost,
} from "../services/api/postApi";
import { usePersistentPanel } from "./usePersistentPanel";
import { useAuth } from "./useAuth";
import type { PostDetail } from "../types/post";

interface UsePostDetailReturn {
  post: PostDetail | null;
  loading: boolean;
  error: string | null;
  handleToggleLike: () => Promise<void>;
  refreshPost: () => Promise<void>;
  handleDeletePost: () => Promise<void>;
  isAuthor: boolean;
}

export const usePostDetail = (
  postId: string | undefined
): UsePostDetailReturn => {
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { navigateWithPanel } = usePersistentPanel();

  // 게시글 상세 정보 가져오기
  const getPost = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPostDetail(postId);
      setPost(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

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

  // 마운트 시 데이터 로드
  useEffect(() => {
    getPost();
  }, [getPost]);

  // 게시글 작성자 여부 판단
  const isAuthor = useMemo(() => {
    console.log(user);
    console.log(post);
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
    refreshPost: getPost,
    handleDeletePost,
    isAuthor,
  };
};
