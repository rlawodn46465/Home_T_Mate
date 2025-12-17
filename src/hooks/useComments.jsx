import { useState, useEffect, useCallback } from "react";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "../services/api/commentApi";
import { useAuth } from "./useAuth";

export const useComments = (postId, initialCommentCount = 0) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount); // 게시글의 댓글 수 상태

  // 1. 댓글 목록 조회
  const loadComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch (err) {
      console.error("댓글 로드 실패:", err);
      setError("댓글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 2. 댓글 작성
  const handleCreateComment = useCallback(
    async (content) => {
      if (!content.trim() || !user) return;

      try {
        const newComment = await createComment(postId, { content });

        setComments((prev) => [...prev, newComment]);
        setCommentCount((prev) => prev + 1);

        return true;
      } catch (err) {
        alert(err.message || "댓글 작성에 실패했습니다.");
        return false;
      }
    },
    [postId, user]
  );

  // 3. 댓글 삭제
  const handleDeleteComment = useCallback(
    async (commentId, authorId) => {
      const currentUserId = user?.user.id || user?.user._id;

      if (!user || String(currentUserId) !== String(authorId)) {
        alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
        return;
      }

      try {
        await deleteComment(commentId);

        // 소프트 삭제 처리 (UI에서 바로 "삭제된 댓글입니다"로 변경)
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, content: "삭제된 댓글입니다.", isDeleted: true }
              : c
          )
        );
        setCommentCount((prev) => prev - 1); // 캐시된 댓글 수 감소

        alert("댓글이 삭제되었습니다.");
      } catch (err) {
        alert(err.message || "댓글 삭제에 실패했습니다.");
        console.error("댓글 삭제 실패:", err);
      }
    },
    [user, deleteComment]
  );

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    commentCount,
    loading,
    error,
    loadComments,
    handleCreateComment,
    handleDeleteComment,
  };
};
