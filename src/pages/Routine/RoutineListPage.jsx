import "./RoutineListPage.css";
import TabNavigation from "../../components/ui/Routine/TabNavigation";
import RoutineHeader from "../../components/ui/Routine/RoutineHeader";
import BodyPartFilter from "../../components/ui/Routine/BodyPartFilter";
import { useState } from "react";
import RoutineItemCard from "../../components/ui/Routine/RoutineItemCard";

const DUMMY_ROUTINES = [
  {
    id: 1,
    type: "루틴",
    title: "푸쉬업 100개 만들기",
    week: 3,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.9,
    status: "진행중",
  },
  {
    id: 2,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.7,
    status: "진행중",
  },
  {
    id: 3,
    type: "루틴",
    title: "푸쉬업 100개 만들기",
    week: 2,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.5,
    status: "진행중",
  },
  {
    id: 4,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.8,
    status: "진행중",
  },
  {
    id: 5,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.8,
    status: "진행중",
  },
  {
    id: 6,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.8,
    status: "진행중",
  },
  {
    id: 7,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.8,
    status: "진행중",
  },
  {
    id: 8,
    type: "챌린지",
    title: "맨몸 운동 3분할 루틴만들기만들기",
    week: 1,
    parts: ["팔", "가슴", "코어"],
    freq: "주 3회",
    creator: "나님",
    progress: 0.8,
    status: "진행중",
  },
  // ... 완료된 루틴 데이터 추가 예정
];

const BODY_PARTS = ["전체", "가슴", "하체", "등", "어깨", "코어", "팔"];

const RoutineListPage = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [activeStatus, setActiveStatus] = useState("진행중");
  const [activePart, setActivePart] = useState("전체");

  const filteredRoutines = DUMMY_ROUTINES.filter((routine) => {
    const typeMatch = activeTab === "전체" || routine.type === activeTab;
    const statusMatch = routine.status === activeStatus;
    const partMatch =
      activePart === "전체" || routine.parts.includes(activePart);
    return typeMatch && statusMatch && partMatch;
  });

  const handleItemAction = (id, action) => {
    console.log(`Routine ID: ${id}, Action: ${action}`);
    // 실제 상태 변경, API 호출 등 로직 구현
  };

  return (
    <div className="routine-list-page">
      <RoutineHeader />
      <TabNavigation
        tabs={["전체", "루틴", "챌린지"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <BodyPartFilter
        parts={BODY_PARTS}
        activePart={activePart}
        onPartChange={setActivePart}
      />

      <div className="status-tabs-container">
        <button
          className={`status-tab ${activeStatus === "진행중" ? "active" : ""}`}
          onClick={() => setActiveStatus("진행중")}
        >
          진행중
        </button>
        <button
          className={`status-tab ${activeStatus === "완료" ? "active" : ""}`}
          onClick={() => setActiveStatus("완료")}
        >
          완료
        </button>
      </div>

      <div className="routine-list-scroll-area">
        {filteredRoutines.map((routine) => (
          <RoutineItemCard
            key={routine.id}
            routine={routine}
            onAction={handleItemAction}
          />
        ))}
        {filteredRoutines.length === 0 && (
          <p className="no-results">표시할 루틴이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RoutineListPage;
