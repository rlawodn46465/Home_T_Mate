import api from "./api";
import type { WeeklyStatsResponse, WeightStatItem } from "../../types/stat";

const API_STATS_PATH = "/api/v1/stats";

// 이번주 운동 통계
export const fetchWeekly = async (): Promise<WeeklyStatsResponse> => {
  const response = await api.get<{ data: WeeklyStatsResponse }>(
    `${API_STATS_PATH}/weekly`
  );
  return response.data.data;
};

// 이번주 부위별 무게 통계
export const fetchWeight = async (): Promise<WeightStatItem[]> => {
  const response = await api.get<{ data: WeightStatItem[] }>(
    `${API_STATS_PATH}/weight`
  );
  return response.data.data;
};
