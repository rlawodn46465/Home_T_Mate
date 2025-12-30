import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  createComment,
  deleteComment,
  fetchComments,
} from "../../services/api/commentApi";
import type { CommentDTO, CreateCommentData } from "../../types/comment";

interface AsyncState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface CommentState {
  listMap: Record<string, CommentDTO[]>;
  countMap: Record<string, number>;

  fetchList: AsyncState;
  create: AsyncState;
  remove: AsyncState;
}

const initialAsync: AsyncState = {
  status: "idle",
  error: null,
};

const initialState: CommentState = {
  listMap: {},
  countMap: {},

  fetchList: initialAsync,
  create: initialAsync,
  remove: initialAsync,
};

// 댓글 목록 조회
export const fetchCommentsThunk = createAsyncThunk<
  { postId: string; comments: CommentDTO[] },
  string,
  { rejectValue: string }
>("comment/fetchList", async (postId, { rejectWithValue }) => {
  try {
    const comments = await fetchComments(postId);
    return { postId, comments };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 댓글 작성
export const createCommentThunk = createAsyncThunk<
  { postId: string; comment: CommentDTO },
  { postId: string; data: CreateCommentData },
  { rejectValue: string }
>("comment/create", async ({ postId, data }, { rejectWithValue }) => {
  try {
    const comment = await createComment(postId, data);
    return { postId, comment };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 댓글 삭제
export const deleteCommentThunk = createAsyncThunk<
  { postId: string; commentId: string },
  { postId: string; commentId: string },
  { rejectValue: string }
>("comment/delete", async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    await deleteComment(commentId);
    return { postId, commentId };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentsByPost(state, action: PayloadAction<string>) {
      delete state.listMap[action.payload];
      delete state.countMap[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // 목록
      .addCase(fetchCommentsThunk.pending, (state) => {
        state.fetchList.status = "loading";
        state.fetchList.error = null;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.fetchList.status = "succeeded";
        state.listMap[postId] = comments;
        state.countMap[postId] = comments.length;
      })
      .addCase(fetchCommentsThunk.rejected, (state, action) => {
        state.fetchList.status = "failed";
        state.fetchList.error = action.payload ?? "댓글 조회 실패";
      })

      // 생성
      .addCase(createCommentThunk.pending, (state) => {
        state.create.status = "loading";
        state.create.error = null;
      })
      .addCase(createCommentThunk.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.create.status = "succeeded";
        state.listMap[postId]?.push(comment);
        state.countMap[postId] = (state.countMap[postId] ?? 0) + 1;
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.create.status = "failed";
        state.create.error = action.payload ?? "댓글 작성 실패";
      })

      // 삭제 (소프트)
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        state.remove.status = "succeeded";

        const list = state.listMap[postId];
        if (!list) return;

        state.listMap[postId] = list.map((c) =>
          c.id === commentId
            ? { ...c, content: "삭제된 댓글입니다.", isDeleted: true }
            : c
        );

        state.countMap[postId] = Math.max((state.countMap[postId] ?? 1) - 1, 0);
      });
  },
});

export const { clearCommentsByPost } = commentSlice.actions;
export default commentSlice.reducer;
