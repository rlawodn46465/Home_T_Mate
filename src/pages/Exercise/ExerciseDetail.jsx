import { useState } from "react";
import MuscleMap from "../../components/common/MuscleMap";
import TabNavigation from "../../components/common/TabNavigation";
import "./ExerciseDetail.css";
import ExerciseInfoSection from "../../components/ui/Exercise/ExerciseInfoSection";
import ExerciseRecordSection from "../../components/ui/Exercise/ExerciseRecordSection";

const ExerciseDetail = () => {
  const TABS = ["설명", "나의 기록"];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const Detail = {
    exercise: {
      _id: "ex_001",
      name: "스쿼트",
      category: "하체",
      targetMuscles: ["대퇴사두"],
      equipment: ["바벨"],
      description: {
        setup: [
          { step: 1, text: "발을 어깨너비로 벌리고 서세요." },
          { step: 2, text: "등을 곧게 펴고 시선을 정면에 둡니다." },
          {
            step: 3,
            text: "바벨을 어깨 위 승모근에 올려 안정적으로 잡습니다.",
          },
        ],
        movement: [
          { step: 1, text: "엉덩이를 뒤로 빼며 무릎을 천천히 굽힙니다." },
          { step: 2, text: "허벅지가 바닥과 평행해질 때까지 내려갑니다." },
          { step: 3, text: "발바닥 전체로 밀며 천천히 일어섭니다." },
        ],
        breathing: [
          { step: 1, text: "내려갈 때 천천히 숨을 들이마십니다." },
          { step: 2, text: "올라올 때 숨을 내쉽니다." },
        ],
        tips: [
          "허리를 말리지 않게 코어를 단단히 고정하세요.",
          "무릎은 발끝 방향과 일직선으로 움직이세요.",
          "발바닥 전체로 균등하게 힘을 주세요.",
        ],
      },
    },

    myStats: {
      best: {
        weight: 150, // 최고 중량(kg)
        volume: 4050, // 최고 볼륨(kg×reps)
        reps: 15, // 최고 반복 수
        time: 45, // 최장 세션 시간(분)
      },
      total: {
        weight: 24500, // 누적 중량
        reps: 370, // 누적 횟수
        volume: 83000, // 누적 볼륨
        time: 230, // 총 운동 시간
      },
      memo: "스쿼트는 허리보다 하체 중심으로 힘을 주는 게 중요.",
    },

    recentLogs: [
      {
        type: "routine",
        sourceName: "하체 루틴 A",
        date: "2025-10-29T18:30:00Z",
        sets: [
          { set: 1, weight: 120, reps: 10 },
          { set: 2, weight: 125, reps: 8 },
          { set: 3, weight: 130, reps: 6 },
        ],
        duration: 20,
      },
      {
        type: "challenge",
        sourceName: "30일 하체 강화 챌린지",
        date: "2025-10-27T19:00:00Z",
        sets: [
          { set: 1, weight: 100, reps: 15 },
          { set: 2, weight: 105, reps: 12 },
        ],
        duration: 15,
      },
      {
        type: "single",
        sourceName: "단독 스쿼트 세션",
        date: "2025-10-25T17:45:00Z",
        sets: [
          { set: 1, weight: 110, reps: 10 },
          { set: 2, weight: 115, reps: 8 },
          { set: 3, weight: 120, reps: 6 },
        ],
        duration: 18,
      },
    ],
  };

  const [persistedMemo, setPersistedMemo] = useState(Detail.myStats.memo);
  const handleMemoSave = (newMemo) => {
    setPersistedMemo(newMemo);
    console.log("메모 저장 완료 : ", newMemo);
  };

  return (
    <div className="exercise-detail-page">
      <h2>운동 기록 상세</h2>
      <div className="exercise-header">
        <MuscleMap selectedTags={Detail.exercise.targetMuscles} />
        <div className="exercise-header-info">
          <h4>{Detail.exercise.name}</h4>
          <p>부위 : {Detail.exercise.targetMuscles.join(", ")}</p>
          <p>장비 : {Detail.exercise.equipment}</p>
        </div>
      </div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "설명" && (
        <ExerciseInfoSection
          description={Detail.exercise.description}
          initialMemo={persistedMemo}
          onMemoSave={handleMemoSave}
        />
      )}
      {activeTab === "나의 기록" && (
        <ExerciseRecordSection
          myStats={Detail.myStats}
          recentLogs={Detail.recentLogs}
        />
      )}
    </div>
  );
};

export default ExerciseDetail;
