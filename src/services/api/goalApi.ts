import api from "./api";
import type {
  GoalDetail,
  DailyRecord,
  TodayGoal,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalStatus,
} from "../../types/goal";

const API_GOALS_PATH = "/api/v1/goals";

// 사용자 모든 루틴/챌린지 목록 조회
export const fetchGoals = async (): Promise<GoalDetail[]> => {
  const response = await api.get<{ data: GoalDetail[] }>(API_GOALS_PATH);
  return response.data.data;
};

// 특정 날짜의 운동 기록 조회
export const fetchDailyExerciseRecords = async (
  dateString: string
): Promise<DailyRecord[]> => {
  if (!dateString) {
    throw new Error("날짜 정보가 필요합니다.");
  }

  const response = await api.get<{ data: DailyRecord[] }>(
    `${API_GOALS_PATH}/records`,
    {
      params: { date: dateString },
    }
  );
  return response.data.data;
};

// 오늘 목표 정보 조회
export const fetchTodayGoals = async (): Promise<TodayGoal[]> => {
  const response = await api.get<{ data: TodayGoal[] }>(
    `${API_GOALS_PATH}/today`
  );
  return response.data.data;
};

// 특정 루틴/챌린지 상세 정보 조회
export const fetchGoalDetail = async (id: string): Promise<GoalDetail> => {
  const response = await api.get<{ data: GoalDetail }>(
    `${API_GOALS_PATH}/${id}`
  );
  return response.data.data;
};

// 새 루틴/챌린지 생성
export const createGoal = async (data: CreateGoalRequest): Promise<string> => {
  const response = await api.post<{ data: { id: string } }>(
    API_GOALS_PATH,
    data
  );
  return response.data.data.id;
};

// 목표 종료
export const finishGoal = async (id: string): Promise<{ id: string; status: GoalStatus }> => {
  const response = await api.patch<{ data: { id: string; status: GoalStatus } }>(
    `${API_GOALS_PATH}/${id}/finish`
  );
  return response.data.data;
};

// 기존 루틴/챌린지 수정
export const updateGoal = async (
  id: string,
  data: UpdateGoalRequest
): Promise<void> => {
  await api.put(`${API_GOALS_PATH}/${id}`, data);
};

// 특정 루틴/챌린지 삭제
export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`${API_GOALS_PATH}/${id}`);
};
