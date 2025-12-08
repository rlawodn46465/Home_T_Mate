import { useEffect, useMemo, useState } from "react";
import TabNavigation from "../../../common/TabNavigation";
import LoadGoalTab from "./LoadTab/LoadGoalTab";
import NewExerciseTab from "./NewExerciseTab/NewExerciseTab";

const TABS = ["불러오기", "새 운동"];
const ExerciseInfoSection = ({ recordId, initialData, type, initialDate }) => {
  const initialActiveTab = useMemo(() => {
    if (recordId) {
      // 수정 모드(수정con PERSONAL을 개별운동으로)
      return type === "개별운동" ? "새 운동" : "불러오기";
    }
    return TABS[0]; // 추가 모드
  }, [recordId, type]);

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // 수정모드 진입 시 탭 고정
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  // 탭 비활성화 여부
  const isDisabled = (tab) => {
    if (!recordId) return false;
    if (type === "개별운동" && tab === "불러오기") return true;
    if (type !== "개별운동" && tab === "새 운동") return true;
    return false;
  };

  return (
    <div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDisabled={isDisabled}
      />
      {activeTab === "불러오기" && (
        <LoadGoalTab
          recordId={recordId}
          initialData={initialData}
          initialDate={initialDate}
        />
      )}
      {activeTab === "새 운동" && (
        <NewExerciseTab
          recordId={recordId}
          initialData={initialData}
          initialDate={initialDate}
        />
      )}
    </div>
  );
};

export default ExerciseInfoSection;
