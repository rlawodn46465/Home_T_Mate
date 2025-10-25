import { useState } from "react";
import MuscleMap from "../../components/common/MuscleMap";
import TabNavigation from "../../components/common/TabNavigation";
import "./ExerciseDetail.css";
import ExerciseInfoSection from "../../components/ui/Exercise/ExerciseInfoSection";
import ExerciseRecordSection from "../../components/ui/Exercise/ExerciseRecordSection";

const ExerciseDetail = () => {
  const TABS = ["설명", "나의 기록"];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const initialMemoContent =
    "오늘의 컨디션: 좋음. 다음 운동 시 무게를 1kg 증량할 예정.";

  const [persistedMemo, setPersistedMemo] = useState(initialMemoContent);
  const handleMemoSave = (newMemo) => {
    setPersistedMemo(newMemo);
    console.log("메모 저장 완료 : ", newMemo);
  };

  const exerciseInfo = {
    title: "런지(덤벨)",
    parts: ["대퇴사두", "종아리"],
    machine: "덤벨",
  };
  return (
    <div className="exercise-detail-page">
      <h2>운동 기록 상세</h2>
      <div className="exercise-header">
        <MuscleMap selectedTags={exerciseInfo.parts} />
        <div className="exercise-header-info">
          <h4>{exerciseInfo.title}</h4>
          <p>부위 : {exerciseInfo.parts.join(", ")}</p>
          <p>장비 : {exerciseInfo.machine}</p>
        </div>
      </div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "설명" && (
        <ExerciseInfoSection
          initialMemo={persistedMemo}
          onMemoSave={handleMemoSave}
        />
      )}
      {activeTab === "나의 기록" && <ExerciseRecordSection />}
    </div>
  );
};

export default ExerciseDetail;
