import { useEffect, useMemo, useState } from "react";
import TabNavigation from "../../../common/TabNavigation";
import LoadGoalTab from "./LoadTab/LoadGoalTab";
import NewExerciseTab from "./NewExerciseTab/NewExerciseTab";

type TabType = (typeof TABS)[number];

interface ExerciseInfoSectionProps {
  recordId?: string;
  initialData?: any;
  type?: string;
  initialDate?: Date;
}

const TABS = ["불러오기", "새 운동"] as const;

const ExerciseInfoSection = ({
  recordId,
  initialData,
  type,
  initialDate,
}: ExerciseInfoSectionProps) => {
  const initialActiveTab = useMemo<TabType>(() => {
    if (recordId) {
      // 수정 모드(수정con PERSONAL을 개별운동으로)
      return type === "개별운동" ? "새 운동" : "불러오기";
    }
    return TABS[0]; // 추가 모드
  }, [recordId, type]);

  const [activeTab, setActiveTab] = useState<TabType>(initialActiveTab);

  // 수정모드 진입 시 탭 고정
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  return (
    <div>
      <TabNavigation
        tabs={TABS as unknown as string[]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
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
