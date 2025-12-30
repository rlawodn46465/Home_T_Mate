import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createCommentThunk,
  deleteCommentThunk,
  fetchCommentsThunk,
} from "../store/slices/commentSlice";

export const useComments = (postId?: string) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const comments = useAppSelector(
    (state) => (postId ? state.comment.listMap[postId] : []) ?? []
  );
  const loading =
    useAppSelector((state) => state.comment.fetchList.status) === "loading";
  const error = useAppSelector((state) => state.comment.fetchList.error);

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsThunk(postId));
    }
  }, [dispatch, postId]);

  const create = useCallback(
    async (content: string) => {
      if (!postId || !user || !content.trim()) return false;

      await dispatch(
        createCommentThunk({
          postId,
          data: { content },
        })
      ).unwrap();

      return true;
    },
    [dispatch, postId, user]
  );

  const remove = useCallback(
    async (commentId: string, authorId: string) => {
      if (!user || String(user.id) !== String(authorId)) return;

      await dispatch(
        deleteCommentThunk({ postId: postId!, commentId })
      ).unwrap();
    },
    [dispatch, postId, user]
  );

  return {
    comments,
    loading,
    error,
    create,
    remove,
  };
};
