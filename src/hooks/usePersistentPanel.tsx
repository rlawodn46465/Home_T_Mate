import { useLocation, useNavigate } from "react-router-dom";

interface UsePersistentPanelReturn {
  currentPath: string;
  getDefaultPanel: () => string;
  navigateWithPanel: (to: string) => void;
  navigateToPanel: (newSearchString: string, toPath?: string) => void;
}

export const usePersistentPanel = (): UsePersistentPanelReturn => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 URL에 panel 쿼리가 없으면 대쉬보드를 기본값으로
  const getDefaultPanel = (): string => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("panel") || "dashboard";
  };

  // 특정 경로로 이동할 때 현재 쿼리 파라미터 자동 유지
  const navigateWithPanel = (to: string): void => {
    const currentParams = new URLSearchParams(location.search);

    let targetPath = location.pathname;
    let newParamsString = "";

    if (to.startsWith("?")) {
      newParamsString = to;
    } else if (to.includes("?")) {
      const parts = to.split("?");
      targetPath = parts[0];
      newParamsString = "?" + parts[1];
    } else {
      targetPath = to;
    }

    const newParams = new URLSearchParams(newParamsString);

    newParams.forEach((value, key) => {
      currentParams.set(key, value);
    });

    if (newParams.has("panel")) {
      currentParams.delete("goalId");
      currentParams.delete("exerciseId");
      currentParams.delete("recordId");
    }

    navigate(`${targetPath}?${currentParams.toString()}`);
  };

  // 패널 쿼리값만 변경
  const navigateToPanel = (
    newSearchString: string,
    toPath: string = location.pathname
  ): void => {
    navigate(`${toPath}${newSearchString}`);
  };

  return {
    navigateWithPanel,
    navigateToPanel,
    getDefaultPanel,
    currentPath: location.pathname,
  };
};
