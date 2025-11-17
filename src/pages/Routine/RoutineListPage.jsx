import "./RoutineListPage.css";
import TabNavigation from "../../components/ui/Routine/TabNavigation";
import RoutineHeader from "../../components/ui/Routine/RoutineHeader";
import BodyPartFilter from "../../components/ui/Routine/BodyPartFilter";
import { useEffect, useState } from "react";
import RoutineItemCard from "../../components/ui/Routine/RoutineItemCard";
import { useRoutines } from "../../hooks/useRoutines";

const DUMMY_ROUTINES = [
  {
    id: 1,  //ㅇ
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
  }
];

const BODY_PARTS = ["전체", "복근", "가슴", "어깨", "이두", "삼두", "전완", "대퇴사두", "승모", "종아리"];

const RoutineListPage = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [activeStatus, setActiveStatus] = useState("진행중");
  const [activePart, setActivePart] = useState("전체");

  const { routines, refreshRoutines } = useRoutines();

  useEffect(()=> {
    refreshRoutines();
  },[]);

  

  // 루텐 리스트 불러올 곳
  const filteredRoutines = routines.filter((routine) => {
    console.log(routine);
    const typeMatch = activeTab === "전체" || routine.parts === activeTab;
    // const statusMatch = routine.status === activeStatus;
    const partMatch =
      activePart === "전체" || routine.parts.includes(activePart);
      console.log("typeMatch : "+typeMatch);
      console.log("partMatch : "+partMatch);
    return typeMatch  && partMatch; //&& statusMatch;
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
