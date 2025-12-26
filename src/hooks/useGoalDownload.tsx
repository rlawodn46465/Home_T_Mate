import { useState, useCallback } from "react";
import { downloadGoal } from "../services/api/postApi";
import { usePersistentPanel } from "./usePersistentPanel";

interface UseGoalDownloadReturn {
  isDownloading: boolean;
  handleDownload: (postId: string, goalName: string) => Promise<boolean>;
}

export const useGoalDownload = (): UseGoalDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const { navigateWithPanel } = usePersistentPanel();

  const handleDownload = useCallback(
    async (postId: string, goalName: string): Promise<boolean> => {
      if (
        !window.confirm(`[${goalName}] 목표를 내 목록으로 가져오시겠습니까?`)
      ) {
        return false;
      }

      setIsDownloading(true);
      try {
        const response = await downloadGoal(postId);
        alert(response.message || "목표를 성공적으로 가져왔습니다!");
        if (window.confirm("지금 바로 내 루틴 목록에서 확인하시겠습니까?")) {
          navigateWithPanel("?panel=goal");
        }
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "목표를 가져오는 데 실패했습니다.";
        alert(errorMessage);
        return false;
      } finally {
        setIsDownloading(false);
      }
    },
    [navigateWithPanel]
  );

  return { handleDownload, isDownloading };
};
