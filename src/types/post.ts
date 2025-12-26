import type { GoalDetail, CustomExercise, GoalType } from "./goal";

export type BoardType = "free" | "exercise";

export interface PostListItem {
  id: string;
  title: string;
  content: string;
  author: string;
  boardType: BoardType;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  hasGoal: boolean;
  createdAt: string;
}

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  boardType: BoardType;
  commentCount: number;
  createdAt: string;
  author: {
    id: string;
    nickname: string;
  };
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  images: string[];
  linkedGoal:
    | (Pick<
        GoalDetail,
        "name" | "goalType" | "durationWeek" | "parts" | "exercises"
      > & { id: string; downloadCount?: number })
    | null;
}

export interface SavePostRequest {
  title: string;
  content: string;
  boardType: BoardType;
  images?: string[];
  userGoalId?: string;
  manualGoalData?: {
    name?: string;
    customExercises: CustomExercise[];
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}
