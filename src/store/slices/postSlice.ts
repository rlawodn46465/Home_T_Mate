import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  BoardType,
  Pagination,
  PostDetail,
  PostListItem,
  SavePostRequest,
} from "../../types/post";
import {
  createPost,
  deletePost,
  downloadGoal,
  fetchPost,
  fetchPostDetail,
  togglePostLike,
  updatePost,
} from "../../services/api/postApi";

interface AsyncState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const createAsyncState = (): AsyncState => ({
  status: "idle",
  error: null,
});

export interface PostQueryParams  {
  page: number;
  limit: number;
  boardType: BoardType | null;
  search: string;
  sort: "latest" | "likes";
}

export interface PostState {
  list: PostListItem[];
  pagination: Pagination;
  queryParams: PostQueryParams;

  detail: PostDetail | null;

  fetchList: AsyncState;
  fetchDetail: AsyncState;
  save: AsyncState;
  like: AsyncState;
  remove: AsyncState;
  download: AsyncState;
}

const initialState: PostState = {
  list: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  },
  queryParams: {
    page: 1,
    limit: 10,
    boardType: null,
    search: "",
    sort: "latest",
  },

  detail: null,

  fetchList: createAsyncState(),
  fetchDetail: createAsyncState(),
  save: createAsyncState(),
  like: createAsyncState(),
  remove: createAsyncState(),
  download: createAsyncState(),
};

// 게시글 목록
export const fetchPostsThunk = createAsyncThunk<
  { list: PostListItem[]; pagination: Pagination },
  void,
  { state: { post: PostState }; rejectValue: string }
>("post/fetchList", async (_, { getState, rejectWithValue }) => {
  try {
    const { queryParams } = getState().post;
    const res = await fetchPost({
      ...queryParams,
      boardType: queryParams.boardType || undefined,
    });
    return { list: res.data, pagination: res.pagination };
  } catch {
    return rejectWithValue("게시글 목록 조회 실패");
  }
});

// 게시글 상세
export const fetchPostDetailThunk = createAsyncThunk<
  PostDetail,
  string,
  { rejectValue: string }
>("post/fetchDetail", async (postId, { rejectWithValue }) => {
  try {
    return await fetchPostDetail(postId);
  } catch {
    return rejectWithValue("게시글 조회 실패");
  }
});

// 저장(생성/수정)
export const savePostThunk = createAsyncThunk<
  void,
  { data: SavePostRequest; postId?: string },
  { rejectValue: string }
>("post/save", async ({ data, postId }, { rejectWithValue }) => {
  try {
    postId ? await updatePost(postId, data) : await createPost(data);
  } catch {
    return rejectWithValue("게시글 저장 실패");
  }
});

// 삭제
export const deletePostThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("post/delete", async (postId, { rejectWithValue }) => {
  try {
    await deletePost(postId);
    return postId;
  } catch {
    return rejectWithValue("게시글 삭제 실패");
  }
});

// 좋아요
export const toggleLikeThunk = createAsyncThunk<
  { postId: string; isLiked: boolean; likeCount: number },
  string,
  { rejectValue: string }
>("post/like", async (postId, { rejectWithValue }) => {
  try {
    return await togglePostLike(postId);
  } catch {
    return rejectWithValue("좋아요 실패");
  }
});

// 목표 다운로드
export const downloadGoalThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("post/downloadGoal", async (postId, { rejectWithValue }) => {
  try {
    await downloadGoal(postId);
  } catch {
    return rejectWithValue("목표 다운로드 실패");
  }
});

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setQueryParams(state, action) {
      const resetPage =
        action.payload.search !== undefined ||
        action.payload.sort !== undefined ||
        action.payload.boardType !== undefined;

      state.queryParams = {
        ...state.queryParams,
        ...action.payload,
        page: resetPage ? 1 : action.payload.page ?? state.queryParams.page,
      };
    },
  },
  extraReducers: (b) => {
    b
      // 목록
      .addCase(fetchPostsThunk.pending, (s) => {
        s.fetchList.status = "loading";
      })
      .addCase(fetchPostsThunk.fulfilled, (s, a) => {
        s.fetchList.status = "succeeded";
        s.list = a.payload.list;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchPostsThunk.rejected, (s, a) => {
        s.fetchList.status = "failed";
        s.fetchList.error = a.payload ?? null;
      })
      // 상세
      .addCase(fetchPostDetailThunk.pending, (s) => {
        s.fetchDetail.status = "loading";
      })
      .addCase(fetchPostDetailThunk.fulfilled, (s, a) => {
        s.fetchDetail.status = "succeeded";
        s.detail = a.payload;
      })
      .addCase(fetchPostDetailThunk.rejected, (s, a) => {
        s.fetchDetail.status = "failed";
        s.fetchDetail.error = a.payload ?? null;
      })
      // 저장
      .addCase(savePostThunk.pending, (s) => {
        s.save.status = "loading";
      })
      .addCase(savePostThunk.fulfilled, (s) => {
        s.save.status = "succeeded";
      })
      .addCase(savePostThunk.rejected, (s, a) => {
        s.save.status = "failed";
        s.save.error = a.payload ?? null;
      })
      // 삭제
      .addCase(deletePostThunk.pending, (s) => {
        s.remove.status = "loading";
      })
      .addCase(deletePostThunk.fulfilled, (s, a) => {
        s.remove.status = "succeeded";
        s.list = s.list.filter((p) => p.id !== a.payload);
      })
      .addCase(deletePostThunk.rejected, (s, a) => {
        s.remove.status = "failed";
        s.remove.error = a.payload ?? null;
      })
      // 좋아요
      .addCase(toggleLikeThunk.fulfilled, (s, a) => {
        if (!s.detail) return;
        s.detail.isLiked = a.payload.isLiked;
        s.detail.likeCount = a.payload.likeCount;
      })
      // 목표 다운로드
      .addCase(downloadGoalThunk.pending, (s) => {
        s.download.status = "loading";
      })
      .addCase(downloadGoalThunk.fulfilled, (s) => {
        s.download.status = "succeeded";
      })
      .addCase(downloadGoalThunk.rejected, (s, a) => {
        s.download.status = "failed";
        s.download.error = a.payload ?? null;
      });
  },
});

export const { setQueryParams } = postSlice.actions;
export default postSlice.reducer;
