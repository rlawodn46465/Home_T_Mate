import { useState, useEffect } from "react";

import "./RoutineDetailPage.css";
import RoutineDetailHeader from "../../components/ui/Routine/RoutineDetailHeader";
import ExerciseList from "../../components/ui/Routine/ExerciseList";
import RoutineSummary from "../../components/ui/Routine/RoutineSummary";
import TabNavigation from "../../components/common/TabNavigation";

const DUMMY_ROUTINE_DETAIL = [
  {
    id: 1,
    type: "루틴",
    title: "루틴 이름",
    createdAt: "2025-09-10 14:20",
    creator: "나님",
    currentWeek: 3,
    targetParts: ["이두", "가슴", "복근"],
    exercises: [
      {
        id: 1,
        name: "런지 (덤벨)",
        sets: "1세트",
        reps: "100회",
        days: ["월", "화", "수", "목", "금", "토"],
      },
      {
        id: 2,
        name: "스쿼트 (맨몸)",
        sets: "3세트",
        reps: "15회",
        days: ["월", "수", "금"],
      },
      {
        id: 3,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 4,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 5,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 6,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 7,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 8,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 9,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
      {
        id: 10,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
    ],
  },
  {
    id: 2,
    type: "챌린지",
    title: "챌린지 이름",
    createdAt: "2025-09-10 14:20",
    creator: "도전자",
    currentWeek: 1,
    targetWeek: 5,
    progress: 0.7,
    targetParts: ["삼두", "가슴", "복근"],
    exercises: [
      {
        id: 1,
        name: "런지 (덤벨)",
        sets: "1세트",
        reps: "100회",
        days: ["월", "화", "수", "목", "금", "토"],
      },
      {
        id: 2,
        name: "스쿼트 (맨몸)",
        sets: "3세트",
        reps: "15회",
        days: ["월", "수", "금"],
      },
      {
        id: 3,
        name: "벤치프레스 (바벨)",
        sets: "4세트",
        reps: "10회",
        days: ["화", "목"],
      },
    ],
  },
];

const RoutineDetailPage = ({ routineId }) => {
  const TABS = ["오늘 운동", "리스트"];

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [routineDetail, setRoutineDetail] = useState(null);

  useEffect(() => {
    // 실제 API 호출 로직 여기로
    const foundRoutine = DUMMY_ROUTINE_DETAIL.find(
      (routine) => routine.id === parseInt(routineId)
    );

    setRoutineDetail(foundRoutine || null);
  }, [routineId]);

  if (!routineDetail) {
    return (
      <div className="routine-detail-page">
        <RoutineDetailHeader
          title="루틴 상세"
          onGoBack={() => window.history.back()}
          showBackButton={true}
        />
        <p className="routine-detail-page__error-message">
          루틴 정보를 불러오는 중이거나 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const handleEdit = () => {
    alert("루틴 수정");
    // 수정 페이지로 이동
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleStartRoutine = () => {
    alert("루틴 시작!");
    // 루틴 시작 로직 (타이머 시작, 운동 기록 등)
  };

  const handleEndRoutine = () => {
    alert("루틴 종료!");
    // 루틴 종료 로직 (결과 저장 등)
  };

  // 현재 요일 계산
  const currentDay = new Date()
    .toLocaleDateString("ko-KR", { weekday: "short" })
    .replace("요일", "");

  // 오늘 운동 리스트 필터링
  const todayExercises = routineDetail.exercises.filter((ex) =>
    ex.days.includes(currentDay)
  );

  // 모든 운동의 요일을 취합
  const allRoutineDays = [
    ...new Set(routineDetail.exercises.flatMap((ex) => ex.days)),
  ];

  return (
    <div className="routine-detail-page">
      <RoutineDetailHeader
        title="루틴 상세"
        onEdit={handleEdit}
        onGoBack={handleGoBack}
        showBackButton={true}
        showEditButton={true}
      />
      <div className="routine-info">
        <h4>{routineDetail.title}</h4>
        <p className="routine-meta">
          생성일 : {routineDetail.createdAt} · 제작자 : {routineDetail.creator}
        </p>
        <RoutineSummary
          routineDetail={routineDetail}
          allRoutineDays={allRoutineDays}
        />
      </div>
      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="exercise-content">
        {activeTab === "오늘 운동" && (
          <ExerciseList exercises={todayExercises} />
        )}
        {activeTab === "리스트" && (
          <ExerciseList exercises={routineDetail.exercises} />
        )}
      </div>
      <div className="routine-actions">
        <button className="start-button" onClick={handleStartRoutine}>
          시작
        </button>
        <button className="end-button" onClick={handleEndRoutine}>
          루틴 끝내기
        </button>
      </div>
    </div>
  );
};

export default RoutineDetailPage;
