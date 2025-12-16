import { useState, useEffect, useCallback } from "react";
import { fetchPostDetail, togglePostLike } from "../services/api/postApi";

export const usePostDetail = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글 상세 정보 가져오기
  const getPost = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
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
    if (!post) return;

    // 낙관적 업데이트 (UI 먼저 반응)
    const prevPost = { ...post };
    const newIsLiked = !post.isLiked;
    const newLikeCount = newIsLiked ? post.likeCount + 1 : post.likeCount - 1;

    setPost((prev) => ({
      ...prev,
      isLiked: newIsLiked,
      likeCount: newLikeCount,
    }));

    try {
      await togglePostLike(post.id);
      // 필요하다면 여기서 최신 데이터를 다시 fetch할 수도 있음
    } catch (err) {
      console.error("좋아요 실패:", err);
      // 실패 시 롤백
      setPost(prevPost);
      alert("좋아요 처리에 실패했습니다.");
    }
  }, [post]);

  // 마운트 시 데이터 로드
  useEffect(() => {
    getPost();
  }, [getPost]);

  return {
    post,
    loading,
    error,
    handleToggleLike,
    refreshPost: getPost, // 댓글 작성 후 갱신 등을 위해 노출
  };
};
