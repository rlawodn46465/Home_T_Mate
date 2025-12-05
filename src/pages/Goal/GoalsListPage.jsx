import "./GoalsListPage.css";
import TabNavigation from "../../components/ui/Goal/GoalList/TabNavigation";
import GoalsHeader from "../../components/ui/Goal/GoalList/GoalsHeader";
import BodyPartFilter from "../../components/ui/Goal/GoalList/BodyPartFilter";
import { useState, useCallback, useMemo } from "react";
import GoalItemCard from "../../components/ui/Goal/GoalList/GoalItemCard";
import { useGoals } from "../../hooks/useGoals";
import { useGoalDelete } from "../../hooks/useGoalDelete";

const BODY_PARTS = [
  "전체",
  "복근",
  "가슴",
  "어깨",
  "이두",
  "삼두",
  "전완",
  "대퇴사두",
  "승모",
  "종아리",
];

const GoalsListPage = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [activeStatus, setActiveStatus] = useState("진행중");
  const [activePart, setActivePart] = useState("전체");

  const { goals, refreshGoals } = useGoals();
  const { isDeleting, deleteGoalHandler } = useGoalDelete();

  // 루틴 리스트 불러올 곳
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const typeMatch = activeTab === "전체" || goal.goalTypeLabel === activeTab;

      // 추가 한국어로 상태 변환
      const statusMatch = goal.status === activeStatus;

      const partMatch =
        activePart === "전체" ||
        (goal.parts && goal.parts.includes(activePart));

      return typeMatch && partMatch && statusMatch;
    });
  }, [goals, activeTab, activeStatus, activePart]);

  const handleItemAction = useCallback(
    async (id, action) => {
      // 실제 상태 변경, API 호출 등 로직 구현
      if (action === "삭제") {
        const isConfirmed = window.confirm("정말 루틴을 삭제하시겠습니까?");

        if (isConfirmed) {
          try {
            await deleteGoalHandler(id);
            alert("루틴이 성공적으로 삭제되었습니다.");
            refreshGoals();
          } catch (error) {
            alert(error.message || "루틴 삭제 중 오류가 발생했습니다.");
          }
        }
      }
    },
    [deleteGoalHandler, refreshGoals]
  );

  return (
    <div className="goal-list-page">
      <GoalsHeader />
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

      <div className="goal-list-scroll-area">
        {filteredGoals.map((goal) => (
          <GoalItemCard
            key={goal.id}
            goals={goal}
            onAction={handleItemAction}
            isDeleting={isDeleting}
          />
        ))}
        {filteredGoals.length === 0 && (
          <p className="no-results">표시할 루틴이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsListPage;
