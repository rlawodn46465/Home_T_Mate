import { useState, useCallback, useMemo } from "react";
import TabNavigation from "../../components/ui/Goal/GoalList/TabNavigation";
import GoalsHeader from "../../components/ui/Goal/GoalList/GoalsHeader";
import BodyPartFilter from "../../components/ui/Goal/GoalList/BodyPartFilter";
import GoalItemCard from "../../components/ui/Goal/GoalList/GoalItemCard";
import { useGoals } from "../../hooks/useGoals";
import { useGoalDelete } from "../../hooks/useGoalDelete";

import styles from "./GoalsListPage.module.css";

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

  // 필터 조건에 따른 목표 리스트 계산
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const typeMatch =
        activeTab === "전체" || goal.goalTypeLabel === activeTab;
      const statusMatch = goal.status === activeStatus;
      const partMatch =
        activePart === "전체" ||
        (goal.parts && goal.parts.includes(activePart));

      return typeMatch && partMatch && statusMatch;
    });
  }, [goals, activeTab, activeStatus, activePart]);

  // 목표 아이템 액션 핸들러 (삭제 등)
  const handleItemAction = useCallback(
    async (id, action) => {
      if (action === "삭제") {
        if (!window.confirm("정말 목표를 삭제하시겠습니까?")) return;

        try {
          await deleteGoalHandler(id);
          alert("목표가 성공적으로 삭제되었습니다.");
          refreshGoals();
        } catch (error) {
          alert(error.message || "목표 삭제 중 오류가 발생했습니다.");
        }
      }
    },
    [deleteGoalHandler, refreshGoals]
  );

  return (
    <div className={styles.goalListPage}>
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
      <div className={styles.statusTabsContainer}>
        <button
          className={`${styles.statusTab} ${
            activeStatus === "진행중" ? styles.statusTabActive : ""
          }`}
          onClick={() => setActiveStatus("진행중")}
        >
          진행중
        </button>
        <button
          className={`${styles.statusTab} ${
            activeStatus === "완료" ? styles.statusTabActive : ""
          }`}
          onClick={() => setActiveStatus("완료")}
        >
          완료
        </button>
      </div>
      <div className={styles.goalListScrollArea}>
        {filteredGoals.map((goal) => (
          <GoalItemCard
            key={goal.id}
            goals={goal}
            onAction={handleItemAction}
            isDeleting={isDeleting}
          />
        ))}

        {filteredGoals.length === 0 && (
          <p className={styles.noResults}>표시할 목표가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsListPage;
