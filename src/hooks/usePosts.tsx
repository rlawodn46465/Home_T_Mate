import { useEffect } from "react";
import type { SavePostRequest } from "../types/post";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  deletePostThunk,
  downloadGoalThunk,
  fetchPostDetailThunk,
  fetchPostsThunk,
  savePostThunk,
  setQueryParams,
  toggleLikeThunk,
} from "../store/slices/postSlice";
import type { PostQueryParams } from "../store/slices/postSlice";

// 게시판 목록 조회 및 검색
export const usePosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, pagination, queryParams, fetchList } = useSelector(
    (s: RootState) => s.post
  );

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch, queryParams]);

  return {
    posts: list,
    pagination,
    queryParams: queryParams as PostQueryParams,
    isLoading: fetchList.status === "loading",
    error: fetchList.error,
    setQueryParams: (p: Partial<PostQueryParams>) =>
      dispatch(setQueryParams(p)),
  };
};

// 게시글 상세 정보 및 액션 (좋아요, 삭제)
export const usePostDetail = (postId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { detail, fetchDetail, remove } = useSelector((s: RootState) => s.post);

  useEffect(() => {
    if (postId) dispatch(fetchPostDetailThunk(postId));
  }, [postId, dispatch]);

  return {
    post: detail,
    loading: fetchDetail.status === "loading",
    error: fetchDetail.error,
    removeLoading: remove.status === "loading",
    handleToggleLike: () => postId && dispatch(toggleLikeThunk(postId)),
    handleDeletePost: () => postId && dispatch(deletePostThunk(postId)),
  };
};

// 게시글 생성 및 수정
export const usePostForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { save } = useSelector((s: RootState) => s.post);

  const savePost = async (data: SavePostRequest, postId?: string) => {
    const result = await dispatch(savePostThunk({ data, postId })).unwrap();
    dispatch(fetchPostsThunk());
    return result;
  };

  return {
    isProcessing: save.status === "loading",
    savePost,
  };
};

// 목표 다운로드
export const useGoalDownload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { download } = useSelector((s: RootState) => s.post);

  return {
    isDownloading: download.status === "loading",
    handleDownload: (postId: string) =>
      dispatch(downloadGoalThunk(postId)).unwrap(),
  };
};
