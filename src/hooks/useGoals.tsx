import { useCallback, useEffect } from "react";
import type { CreateGoalRequest, UpdateGoalRequest } from "../types/goal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createGoalThunk,
  deleteGoalThunk,
  fetchGoalDetailThunk,
  fetchGoalsThunk,
  fetchTodayGoalsThunk,
  finishGoalThunk,
  updateGoalThunk,
} from "../store/slices/goalsSlice";

// 목표 목록 및 오늘 목표 조회
export const useGoals = () => {
  const dispatch = useAppDispatch();

  const goals = useAppSelector((state) => state.goals.list);
  const todayGoals = useAppSelector((state) => state.goals.today);
  const fetchList = useAppSelector((state) => state.goals.fetchList);
  const fetchToday = useAppSelector((state) => state.goals.fetchToday);

  useEffect(() => {
    if (fetchList.status === "idle") {
      dispatch(fetchGoalsThunk());
    }
    if (fetchToday.status === "idle") {
      dispatch(fetchTodayGoalsThunk());
    }
  }, [dispatch, fetchList.status, fetchToday.status]);

  const refreshGoals = useCallback(() => {
    dispatch(fetchGoalsThunk());
  }, [dispatch]);

  const loadTodayGoals = useCallback(() => {
    dispatch(fetchTodayGoalsThunk());
  }, [dispatch]);

  return {
    goals,
    todayGoals,

    loading: fetchList.status === "loading",
    todayLoading: fetchToday.status === "loading",

    error: fetchList.error,
    todayError: fetchToday.error,

    refreshGoals,
    loadTodayGoals,
  };
};

// 특정 목표의 상세 조회
export const useGoalDetail = (
  goalId: string | undefined,
  shouldFetch: boolean = true
) => {
  const dispatch = useAppDispatch();

  const goal = useAppSelector((state) =>
    goalId ? state.goals.detailMap[goalId] : null
  );

  const fetchDetail = useAppSelector((state) => state.goals.fetchDetail);

  useEffect(() => {
    if (goalId && shouldFetch && fetchDetail.status !== "loading" && !goal) {
      dispatch(fetchGoalDetailThunk(goalId));
    }
  }, [dispatch, goalId, shouldFetch, goal, fetchDetail.status]);

  const refetchDetail = useCallback(() => {
    if (goalId) {
      dispatch(fetchGoalDetailThunk(goalId));
    }
  }, [dispatch, goalId]);

  return {
    goal,
    loading: fetchDetail.status === "loading",
    error: fetchDetail.error,
    refetchDetail,
  };
};

// 목표 저장(생성/수정)
export const useGoalSave = () => {
  const dispatch = useAppDispatch();
  const save = useAppSelector((state) => state.goals.save);

  const saveGoalHandler = useCallback(
    async (
      goalData: CreateGoalRequest | UpdateGoalRequest,
      isEditMode: boolean,
      goalId?: string
    ) => {
      if (save.status === "loading") return;

      if (!isEditMode) {
        const name = (goalData as CreateGoalRequest).name?.trim();
        if (!name) {
          throw new Error("목표 이름을 입력해주세요.");
        }
      }

      if (isEditMode && goalId) {
        await dispatch(
          updateGoalThunk({
            goalId,
            data: goalData as UpdateGoalRequest,
          })
        ).unwrap();

        dispatch(fetchGoalsThunk());
        dispatch(fetchTodayGoalsThunk());

        return { message: "수정되었습니다." };
      }

      const result = await dispatch(
        createGoalThunk(goalData as CreateGoalRequest)
      ).unwrap();

      dispatch(fetchGoalsThunk());
      dispatch(fetchTodayGoalsThunk());

      return { message: "생성되었습니다.", id: result.id };
    },
    [dispatch, save.status]
  );

  return {
    isSaving: save.status === "loading",
    error: save.error,
    saveGoalHandler,
  };
};

// 목표 종료
export const useGoalFinish = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.goals.save);

  const finishGoalHandler = useCallback(
    async (goalId: string) => {
      return await dispatch(finishGoalThunk(goalId)).unwrap();
    },
    [dispatch]
  );

  return {
    finishGoalHandler,
    isFinishing: status === "loading",
    error,
  };
};

// 목표 삭제
export const useGoalDelete = () => {
  const dispatch = useAppDispatch();
  const save = useAppSelector((state) => state.goals.save);

  const deleteGoalHandler = useCallback(
    async (goalId: string) => {
      if (save.status === "loading") return;
      await dispatch(deleteGoalThunk(goalId)).unwrap();
      dispatch(fetchGoalsThunk());
      dispatch(fetchTodayGoalsThunk());
    },
    [dispatch, save.status]
  );

  return {
    isDeleting: save.status === "loading",
    error: save.error,
    deleteGoalHandler,
  };
};
